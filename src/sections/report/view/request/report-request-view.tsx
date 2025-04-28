import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { Form } from 'src/components/form/form';
import { useDivisionByCompanyId, useInternalCompanies } from 'src/services/master-data/company';

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
    value: 'summary-detail',
    label: 'Summary & Detail',
  },
];

const timePeriodOptions = [
  {
    value: 'this-month',
    label: 'This month',
  },
  {
    value: 'this-year',
    label: 'This year',
  },
  {
    value: 'last-30-days',
    label: 'Last 30 days',
  },
  {
    value: 'last-3-months',
    label: 'Last 3 months',
  },
  {
    value: 'last-6-months',
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

  const { data: internalCompanies } = useInternalCompanies();
  const { data: divisions } = useDivisionByCompanyId(1);
  const [timePeriod, setTimePeriod] = useState('this-month');
  const [docType, setDocType] = useState('summary-detail');
  const [clientMode, setClientMode] = useState('all');
  const [divisionMode, setDivisionMode] = useState('all');
  const [requestStatusMode, setRequestStatusMode] = useState('all');
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(null);
  const defaultValues = {
    internal_id: [],
    division_id: [],
  };
  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
  };

  const handleChangeEndDate = (newValue: Dayjs | null) => {
    setEndDateValue(newValue);
  };

  const handleSubmit = (formData: any) => {
    console.log(formData, 'log: formData report request');
    // setIsLoading(true);
    // const payload = {
    //   ...formData,
    //   company_id: String(idCurrentCompany),
    //   is_custom: isCustom === 'true',
    // };
    // if (isCustom === 'true') {
    //   Object.assign(payload, {
    //     start_date: dateValue?.format('YYYY-MM-DD hh:mm'),
    //     end_date: endDateValue?.format('YYYY-MM-DD hh:mm'),
    //   });
    // }
    // try {
    //   if (defaultValue) {
    //     updateAutoResponse({
    //       ...payload,
    //       id: defaultValue?.id,
    //     });
    //   } else {
    //     addAutoResponse(payload);
    //   }
    //   setIsLoading(false);
    // } catch (error) {
    //   setIsLoading(false);
    // }
  };

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
                onClick={() => navigate('/report/request')}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="solar:inbox-bold" />
                <Typography>Requests</Typography>
              </Box>

              <Box
                onClick={() => navigate('/report/work-allocation')}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="solar:file-text-bold" />
                <Typography color="grey.600">Work Allocation</Typography>
              </Box>

              <Box
                onClick={() => navigate('/report/work-performance')}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="solar:users-group-rounded-bold" />
                <Typography color="grey.600">Work Performance</Typography>
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
                              <DateTimePicker
                                sx={{
                                  width: '50%',
                                }}
                                label="Start From"
                                value={dateValue}
                                onChange={handleChangeDate}
                              />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DateTimePicker
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
                                label="Internal Company"
                                labelId="demo-simple-select-outlined-label-type"
                                error={Boolean(formState?.errors?.internal_id)}
                                id="internal_id"
                                {...register('internal_id')}
                                multiple
                                value={watch('internal_id')}
                                input={
                                  <OutlinedInput
                                    error={Boolean(formState?.errors?.internal_id)}
                                    id="select-multiple-chip"
                                    label="Chip"
                                  />
                                }
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                renderValue={() => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {watch('internal_id')?.map((value: any) => (
                                      <Chip
                                        sx={{
                                          bgcolor: '#D6F3F9',
                                          color: 'info.dark',
                                        }}
                                        key={value}
                                        label={
                                          internalCompanies?.find((item) => item?.id === value)
                                            ?.name
                                        }
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {internalCompanies &&
                                  internalCompanies?.map((company) => (
                                    <MenuItem
                                      key={company?.id}
                                      value={company?.id}
                                      style={getStyles(
                                        company?.id,
                                        watch('internal_id') ?? [],
                                        theme
                                      )}
                                    >
                                      {company?.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                            {formState?.errors?.internal_id && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {String(formState?.errors?.internal_id?.message)}
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
                                id="internal_id"
                                {...register('division_id')}
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
                                        label={divisions?.find((item) => item?.id === value)?.name}
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {divisions &&
                                  divisions?.map((division) => (
                                    <MenuItem
                                      key={division?.id}
                                      value={division?.id}
                                      style={getStyles(
                                        division?.id,
                                        watch('division_id') ?? [],
                                        theme
                                      )}
                                    >
                                      {division?.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                            {formState?.errors?.internal_id && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {String(formState?.errors?.internal_id?.message)}
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
