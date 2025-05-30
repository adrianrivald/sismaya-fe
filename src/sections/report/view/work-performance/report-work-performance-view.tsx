/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */
import { Suspense, useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent, Theme } from '@mui/material';
import {
  Box,
  Button,
  capitalize,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
} from '@mui/material';
import type { Dayjs } from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form } from 'src/components/form/form';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useReportWorkPerformance } from 'src/services/report/work-performance/use-report-work-performance';
import { useInternalUsers } from 'src/services/master-data/user';
import type { ReportWorkPerformanceDTO } from 'src/services/report/work-performance/schemas/work-performance-schema';
import { useDivisionByCompanyId } from 'src/services/master-data/company';
import ReportWorkPerformanceIndividualPDF from './individual-report-pdf';
import ReportWorkPerformanceOverallPDF from './overall-report-pdf';
import ReportWorkPerformanceDivisionPDF from './division-report-pdf';

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

function getStyles(id: number, user_id: readonly number[], theme: Theme) {
  return {
    fontWeight:
      user_id.indexOf(id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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

const reportTypeOptions = [
  {
    value: 'overall',
    label: 'Overall Performance',
  },
  {
    value: 'division',
    label: 'Division Performance',
  },
  {
    value: 'individual',
    label: 'Individual Performance',
  },
];

export function ReportWorkPerformanceView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { vendor } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { data: employeeList } = useInternalUsers(String(idCurrentCompany));
  const { data: divisionList } = useDivisionByCompanyId(idCurrentCompany);
  const [timePeriod, setTimePeriod] = useState('month');
  const [reportType, setReportType] = useState('overall');
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(null);
  const {
    mutate: generateReportWorkPerformance,
    data: reportData,
    reset,
    isIdle,
  } = useReportWorkPerformance();
  const [isIncludeIndividual, setIsIncludeIndividual] = useState(false);
  const [isShowBreakdownByRequest, setShowBreakdownByRequest] = useState(false);

  const defaultValues = {
    user_id: [],
    department_id: [],
  };

  useEffect(() => {
    reset();
  }, [reportData, reset]);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
  };

  const onCheckIncludeIndividual = () => {
    setIsIncludeIndividual((prev) => !prev);
  };
  const onCheckShowBreakdownByRequest = () => {
    setShowBreakdownByRequest((prev) => !prev);
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

    const marginTop = 40; // Adjust as needed

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

  const handleChangeEndDate = (newValue: Dayjs | null) => {
    setEndDateValue(newValue);
  };

  const handleSubmit = (formData: ReportWorkPerformanceDTO) => {
    // setIsLoading(true);
    const payload = {
      internalCompanyId: String(idCurrentCompany),
      period: timePeriod ?? '',
      reportType,
    };
    if (reportType === 'individual') {
      Object.assign(payload, {
        userId: formData.user_id,
      });
    }

    if (reportType === 'division') {
      Object.assign(payload, {
        department_id: formData.department_id,
      });
    }

    if (isIncludeIndividual) {
      Object.assign(payload, {
        include_individual: true,
      });
    }

    if (isShowBreakdownByRequest) {
      Object.assign(payload, {
        breakdown_by_request: true,
      });
    }

    if (timePeriod === 'custom') {
      Object.assign(payload, {
        from: dateValue?.format('YYYY-MM-DD hh:mm'),
        to: endDateValue?.format('YYYY-MM-DD hh:mm'),
      });
    }
    try {
      generateReportWorkPerformance(payload);
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
                <Typography>Work Performance</Typography>
              </Box>

              <Box
                onClick={() => navigate(`/${vendor}/report/request`)}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="solar:inbox-bold" />
                <Typography color="grey.600">Requests</Typography>
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
                  Work Performance
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
                  {({ register, control, watch, formState, setValue }) => (
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
                              reset();
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
                      <Box mt={4}>
                        <FormControl sx={{ width: '100%', mb: 4 }}>
                          <Typography
                            fontWeight={600}
                            mb={1}
                            component="label"
                            htmlFor="time-period"
                          >
                            Report Type
                          </Typography>

                          <Select
                            value={reportType}
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
                              setReportType(e.target.value);
                            }}
                            id="time-period"
                          >
                            {reportTypeOptions?.map((item) => (
                              <MenuItem value={item.value}>{capitalize(`${item?.label}`)}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {reportType === 'individual' && (
                          <>
                            <FormControl fullWidth>
                              <InputLabel id="user_id">Select Client</InputLabel>

                              <Select
                                label="Select Client"
                                labelId="demo-simple-select-outlined-label-type"
                                error={Boolean(formState?.errors?.user_id)}
                                id="user_id"
                                {...register('user_id')}
                                multiple
                                value={watch('user_id')}
                                input={
                                  <OutlinedInput
                                    error={Boolean(formState?.errors?.user_id)}
                                    id="select-multiple-chip"
                                    label="Chip"
                                  />
                                }
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                renderValue={() => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {watch('user_id')?.map((value: any) => (
                                      <Chip
                                        sx={{
                                          bgcolor: '#D6F3F9',
                                          color: 'info.dark',
                                        }}
                                        key={value}
                                        label={
                                          employeeList?.find((item) => item?.id === value)
                                            ?.user_info.name
                                        }
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {employeeList &&
                                  employeeList?.map((employee) => (
                                    <MenuItem
                                      key={employee?.id}
                                      value={employee?.id}
                                      style={getStyles(employee?.id, watch('user_id') ?? [], theme)}
                                    >
                                      {employee?.user_info.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                            {formState?.errors?.user_id && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {String(formState?.errors?.user_id?.message)}
                              </FormHelperText>
                            )}
                          </>
                        )}

                        {reportType === 'division' && (
                          <>
                            <Box>
                              <FormControl fullWidth>
                                <InputLabel id="department_id">Select Division</InputLabel>

                                <Select
                                  label="Select Division"
                                  labelId="demo-simple-select-outlined-label-type"
                                  error={Boolean(formState?.errors?.department_id)}
                                  id="department_id"
                                  {...register('department_id')}
                                  multiple
                                  value={watch('department_id')}
                                  input={
                                    <OutlinedInput
                                      error={Boolean(formState?.errors?.department_id)}
                                      id="select-multiple-chip"
                                      label="Chip"
                                    />
                                  }
                                  onMouseDown={(event) => {
                                    event.stopPropagation();
                                  }}
                                  renderValue={() => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {watch('department_id')?.map((value: any) => (
                                        <Chip
                                          sx={{
                                            bgcolor: '#D6F3F9',
                                            color: 'info.dark',
                                          }}
                                          key={value}
                                          label={
                                            divisionList?.find((item) => item?.id === value)?.name
                                          }
                                        />
                                      ))}
                                    </Box>
                                  )}
                                  MenuProps={MenuProps}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                >
                                  {divisionList &&
                                    divisionList?.map((division) => (
                                      <MenuItem
                                        key={division?.id}
                                        value={division?.id}
                                        style={getStyles(
                                          division?.id,
                                          watch('department_id') ?? [],
                                          theme
                                        )}
                                      >
                                        {division?.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                              {formState?.errors?.user_id && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                  {String(formState?.errors?.user_id?.message)}
                                </FormHelperText>
                              )}
                            </Box>
                            <Box mt={2} display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                id="include-individual"
                                checked={isIncludeIndividual}
                                onChange={onCheckIncludeIndividual}
                                onClick={(e) => e.stopPropagation()} // Stops accordion toggle
                              />{' '}
                              <Typography
                                sx={{
                                  cursor: 'pointer',
                                }}
                                component="label"
                                htmlFor="include-individual"
                              >
                                Include individual breakdown
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                id="show-breakdown"
                                checked={isShowBreakdownByRequest}
                                onChange={onCheckShowBreakdownByRequest}
                                onClick={(e) => e.stopPropagation()} // Stops accordion toggle
                              />{' '}
                              <Typography
                                sx={{
                                  cursor: 'pointer',
                                }}
                                component="label"
                                htmlFor="show-breakdown"
                              >
                                Show breakdown by request
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Box>

                      <Box mt={24}>
                        <Button sx={{ width: '100%' }} type="submit" variant="contained">
                          Generate & Download Report
                        </Button>
                        {reportType === 'individual' && !isIdle && (
                          <Suspense>
                            <ReportWorkPerformanceIndividualPDF
                              timePeriod={timePeriod}
                              vendor={vendor?.toUpperCase() ?? ''}
                              data={{
                                reportData: reportData?.data,
                                image: reportData?.meta?.company_image,
                              }}
                              hiddenRef={hiddenRef}
                              reportType={reportType}
                            />
                          </Suspense>
                        )}
                        {reportType === 'division' && !isIdle && (
                          <Suspense>
                            <ReportWorkPerformanceDivisionPDF
                              timePeriod={timePeriod}
                              vendor={vendor?.toUpperCase() ?? ''}
                              data={{
                                reportData: reportData?.data,
                                image: reportData?.meta?.company_image,
                              }}
                              hiddenRef={hiddenRef}
                              reportType={reportType}
                            />
                          </Suspense>
                        )}
                        {reportType === 'overall' && !isIdle && (
                          <Suspense>
                            <ReportWorkPerformanceOverallPDF
                              timePeriod={timePeriod}
                              vendor={vendor?.toUpperCase() ?? ''}
                              data={{
                                reportData: reportData?.data,
                                image: reportData?.meta?.company_image,
                              }}
                              hiddenRef={hiddenRef}
                              reportType={reportType}
                            />
                          </Suspense>
                        )}
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
