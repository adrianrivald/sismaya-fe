/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */
import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent, Theme } from '@mui/material';
import {
  Box,
  Button,
  capitalize,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Chip,
  useTheme,
} from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { useNavigate, useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { Form } from 'src/components/form/form';
import {
  useCompanyRelation,
  useDivisionByCompanyId,
  useInternalCompanies,
  useNonInternalCompanies,
} from 'src/services/master-data/company';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useDepartmentName } from 'src/services/report/request/use-department-name';
import { useDepartmentId } from 'src/services/report/request/use-department-id';
import { useReportRequest } from 'src/services/report/request/use-report-request';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReportRequestPDF from './report-pdf';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(id: number, selectedInternalCompanies: readonly number[], theme: Theme) {
  return {
    fontWeight:
      selectedInternalCompanies.indexOf(id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const docTypeOptions = [
  {
    value: 'all',
    label: 'Summary & Detail',
  },
  {
    value: 'summary',
    label: 'Summary',
  },
  {
    value: 'detail',
    label: 'Detail',
  },
];

const timePeriodOptions = [
  {
    value: 'month',
    label: 'This month',
  },
  {
    value: 'year',
    label: 'This year',
  },
  {
    value: '30-days',
    label: 'Last 30 days',
  },
  {
    value: '3-months',
    label: 'Last 3 months',
  },
  {
    value: '6-months',
    label: 'Last 6 months',
  },
  {
    value: 'custom',
    label: 'Custom period',
  },
];

export function ReportRequestView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { vendor } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { mutate: getDepartmentName, data: departmentNames } = useDepartmentName();
  const { mutate: getDepartmentId, data: departmentIds } = useDepartmentId();
  const { mutate: generateReportRequest, data: reportData } = useReportRequest();
  const divisions = departmentNames?.data;
  const divisionIds = departmentIds?.data;
  const { data: companyRelations } = useCompanyRelation({ internal_company_id: idCurrentCompany });
  const clientCompanies = companyRelations?.items;
  const [timePeriod, setTimePeriod] = useState('month');
  const [docType, setDocType] = useState('all');
  const [clientMode, setClientMode] = useState('all');
  const [divisionMode, setDivisionMode] = useState('all');
  const [requestStatusMode, setRequestStatusMode] = useState('all');
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(null);
  const defaultValues = {
    client_company_id: [],
    division_id: [],
  };

  const hiddenRef = useRef<HTMLDivElement>(null);

  const generatePdf = async () => {
    const element = hiddenRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2, // optional: higher resolution
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4'); // pt = points

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgHeight = (pdfWidth * canvasHeight) / canvasWidth;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add remaining pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Either open in new tab or save
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
  };

  const handleChangeEndDate = (newValue: Dayjs | null) => {
    setEndDateValue(newValue);
  };

  const handleSubmit = (formData: any) => {
    console.log(formData, 'formData');
    // setIsLoading(true);
    const payload = {
      internalCompanyId: String(idCurrentCompany),
      period: timePeriod ?? '',
      document_type: docType,
    };

    if (divisionMode === 'custom') {
      Object.assign(payload, {
        departmentId: divisionIds.join(',') ?? '',
      });
    }

    console.log(payload, 'payload');
    if (timePeriod === 'custom') {
      Object.assign(payload, {
        from: dateValue?.format('YYYY-MM-DD hh:mm'),
        to: endDateValue?.format('YYYY-MM-DD hh:mm'),
      });
    }
    try {
      generateReportRequest(payload);
    } catch (error) {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (reportData) {
      generatePdf();
    }
  }, [reportData]);

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Generate PT SIM Report
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} spacing={2}>
          <Box bgcolor="grey.200" p={2} borderRadius={2} display="flex" gap={2}>
            <Box
              borderRadius={2}
              p={4}
              bgcolor="common.white"
              display="flex"
              flexDirection="column"
              width="30%"
              gap={2}
            >
              <Box
                onClick={() => navigate(`/${vendor}/report/work-allocation`)}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="solar:file-text-bold" />
                <Typography color="grey.600">Work Allocation</Typography>
              </Box>

              <Box
                onClick={() => navigate(`/${vendor}/report/work-performance`)}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="solar:users-group-rounded-bold" />
                <Typography color="grey.600">Work Performance</Typography>
              </Box>
              <Box
                onClick={() => navigate(`/${vendor}/report/request`)}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="solar:inbox-bold" />
                <Typography>Requests</Typography>
              </Box>
            </Box>
            <Box
              borderRadius={2}
              bgcolor="common.white"
              display="flex"
              flexDirection="column"
              width="70%"
            >
              <Box p={2} pb={0}>
                <Typography variant="h6" fontSize="18">
                  Requests
                </Typography>
              </Box>
              <Divider sx={{ mt: 2, borderStyle: 'dashed' }} />

              <Box p={2}>
                <Form
                  width="100%"
                  onSubmit={handleSubmit}
                  options={{
                    defaultValues: {
                      ...defaultValues,
                    },
                  }}
                  //  schema={autoResponseSchema}
                >
                  {({ register, watch, formState, setValue }) => (
                    <>
                      <Box>
                        <FormControl sx={{ width: '100%' }}>
                          <Typography
                            fontWeight={600}
                            mb={1}
                            component="label"
                            htmlFor="time-period"
                          >
                            Time Period
                          </Typography>

                          <Select
                            value={timePeriod}
                            sx={{
                              height: 54,
                              paddingY: 0.5,
                              borderWidth: 0,
                              borderRadius: 1.5,
                              width: '100%',

                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 1,
                              },
                            }}
                            onChange={(e: SelectChangeEvent<string>) => {
                              setTimePeriod(e.target.value);
                            }}
                            id="time-period"
                          >
                            {timePeriodOptions?.map((item) => (
                              <MenuItem value={item.value}>{capitalize(`${item?.label}`)}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {timePeriod === 'custom' && (
                          <Box
                            mt={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            gap={2}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                sx={{
                                  width: '50%',
                                }}
                                label="Start From"
                                value={dateValue}
                                onChange={handleChangeDate}
                              />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                sx={{
                                  width: '50%',
                                }}
                                label="Until"
                                value={endDateValue}
                                onChange={handleChangeEndDate}
                              />
                            </LocalizationProvider>
                            {formState?.errors?.estimated_duration && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {String(formState?.errors?.estimated_duration?.message)}
                              </FormHelperText>
                            )}
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <FormControl sx={{ width: '100%', mt: 4 }}>
                          <Typography
                            fontWeight={600}
                            mb={1}
                            component="label"
                            htmlFor="time-period"
                          >
                            Client
                          </Typography>

                          <RadioGroup>
                            <Box display="flex">
                              {[
                                { value: 'all', label: 'All' },
                                { value: 'custom', label: 'Custom' },
                              ].map((option) => (
                                <FormControlLabel
                                  key={option.value}
                                  value={option.value}
                                  control={
                                    <Radio
                                      checked={clientMode.includes(option.value)}
                                      onChange={() => setClientMode(option.value)}
                                    />
                                  }
                                  label={option.label}
                                />
                              ))}
                            </Box>
                          </RadioGroup>
                        </FormControl>
                        {clientMode === 'custom' && (
                          <>
                            <FormControl fullWidth>
                              <InputLabel id="select-company">Select Client</InputLabel>

                              <Select
                                label="Company"
                                labelId="demo-simple-select-outlined-label-type"
                                error={Boolean(formState?.errors?.client_company_id)}
                                id="client_company_id"
                                {...register('client_company_id', {
                                  onChange: (e) => {
                                    getDepartmentName(e.target.value.join(','));
                                  },
                                })}
                                multiple
                                value={watch('client_company_id')}
                                input={
                                  <OutlinedInput
                                    error={Boolean(formState?.errors?.client_company_id)}
                                    id="select-multiple-chip"
                                    label="Chip"
                                  />
                                }
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                renderValue={() => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {watch('client_company_id')?.map((value: any) => (
                                      <Chip
                                        sx={{
                                          bgcolor: '#D6F3F9',
                                          color: 'info.dark',
                                        }}
                                        key={value}
                                        label={
                                          clientCompanies?.find(
                                            (item) => item?.client_company?.id === value
                                          )?.client_company?.name
                                        }
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {clientCompanies &&
                                  clientCompanies?.map((company) => (
                                    <MenuItem
                                      key={company?.client_company?.id}
                                      value={company?.client_company?.id}
                                      style={getStyles(
                                        company?.client_company?.id,
                                        watch('client_company_id') ?? [],
                                        theme
                                      )}
                                    >
                                      {company?.client_company?.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                            {formState?.errors?.client_company_id && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {String(formState?.errors?.client_company_id?.message)}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      </Box>

                      <Box>
                        <FormControl sx={{ width: '100%', mt: 4 }}>
                          <Typography
                            fontWeight={600}
                            mb={1}
                            component="label"
                            htmlFor="time-period"
                          >
                            Division
                          </Typography>

                          <RadioGroup>
                            <Box display="flex">
                              {[
                                { value: 'all', label: 'All' },
                                { value: 'custom', label: 'Custom' },
                              ].map((option) => (
                                <FormControlLabel
                                  key={option.value}
                                  value={option.value}
                                  control={
                                    <Radio
                                      checked={divisionMode.includes(option.value)}
                                      onChange={() => setDivisionMode(option.value)}
                                    />
                                  }
                                  label={option.label}
                                />
                              ))}
                            </Box>
                          </RadioGroup>
                        </FormControl>

                        {divisionMode === 'custom' && (
                          <>
                            <FormControl fullWidth>
                              <InputLabel id="select-company">Select Division</InputLabel>

                              <Select
                                label="Internal Company"
                                labelId="demo-simple-select-outlined-label-type"
                                error={Boolean(formState?.errors?.division_id)}
                                id="division_id"
                                {...register('division_id', {
                                  onChange: (e) => {
                                    getDepartmentId({
                                      companyId: watch('client_company_id').join(','),
                                      departmentName: e.target.value.join(','),
                                    });
                                  },
                                })}
                                multiple
                                value={watch('division_id')}
                                input={
                                  <OutlinedInput
                                    error={Boolean(formState?.errors?.division_id)}
                                    id="select-multiple-chip"
                                    label="Chip"
                                  />
                                }
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                renderValue={() => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {watch('division_id')?.map((value: any) => (
                                      <Chip
                                        sx={{
                                          bgcolor: '#D6F3F9',
                                          color: 'info.dark',
                                        }}
                                        key={value}
                                        label={
                                          divisions?.find(
                                            (item: any) => item?.department_name === value
                                          )?.department_name
                                        }
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {divisions &&
                                  divisions?.map((division: any) => (
                                    <MenuItem
                                      key={division?.department_name}
                                      value={division?.department_name}
                                      style={getStyles(
                                        division?.department_name,
                                        watch('division_id') ?? [],
                                        theme
                                      )}
                                    >
                                      {division?.department_name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                            {formState?.errors?.division_id && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {String(formState?.errors?.division_id?.message)}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      </Box>

                      <FormControl sx={{ width: '100%', mt: 4 }}>
                        <Typography fontWeight={600} mb={1} component="label" htmlFor="time-period">
                          Request Status
                        </Typography>

                        <RadioGroup>
                          <Box display="flex">
                            {[
                              { value: 'all', label: 'All' },
                              { value: 'custom', label: 'Custom' },
                            ].map((option) => (
                              <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                  <Radio
                                    checked={requestStatusMode.includes(option.value)}
                                    onChange={() => setRequestStatusMode(option.value)}
                                  />
                                }
                                label={option.label}
                              />
                            ))}
                          </Box>
                        </RadioGroup>
                      </FormControl>

                      <FormControl sx={{ width: '100%', mt: 4 }}>
                        <Typography fontWeight={600} mb={1} component="label" htmlFor="doc-type">
                          Document Type
                        </Typography>

                        <Select
                          value={docType}
                          sx={{
                            height: 54,
                            paddingY: 0.5,
                            borderWidth: 0,
                            borderRadius: 1.5,
                            width: '100%',

                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 1,
                            },
                          }}
                          onChange={(e: SelectChangeEvent<string>) => {
                            setDocType(e.target.value);
                          }}
                          id="doc-type"
                        >
                          {docTypeOptions?.map((item) => (
                            <MenuItem value={item.value}>{capitalize(`${item?.label}`)}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Box mt={24}>
                        <Button sx={{ width: '100%' }} type="submit" variant="contained">
                          Generate & Download Report
                        </Button>
                        <ReportRequestPDF
                          timePeriod={timePeriod}
                          startDate={dateValue}
                          endDate={endDateValue}
                          vendor={vendor?.toUpperCase() ?? ''}
                          data={{
                            reportData: reportData?.data,
                            image: reportData?.meta?.company_image,
                          }}
                          hiddenRef={hiddenRef}
                        />
                      </Box>
                    </>
                  )}
                </Form>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
