import Typography from '@mui/material/Typography';
import type { SelectChangeEvent, Theme } from '@mui/material';
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
  Card,
  FormControlLabel,
  Switch,
  capitalize,
  // eslint-disable-next-line import/no-duplicates
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { LoadingButton } from '@mui/lab';
import React, { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { useAddUser } from 'src/services/master-data/user';
import { useRole } from 'src/services/master-data/role';
import { useInternalCompanies } from 'src/services/master-data/company';
import type {
  UserInternalDTO,
  UserClientDTO,
} from 'src/services/master-data/user/schemas/user-schema';
import { userInternalSchema } from 'src/services/master-data/user/schemas/user-schema';
// eslint-disable-next-line import/no-duplicates
import { Checkbox } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

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

export function AutoResponseView() {
  const [currentPeriod, setCurrentPeriod] = useState('-');

  const [isActive, setIsActive] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { mutate: addUser } = useAddUser({ isRbac: true });

  const defaultValues = {
    internal_id: [],
  };

  const handleSubmit = (formData: UserClientDTO | UserInternalDTO) => {
    setIsLoading(true);
    // const { internal_id, ...restForm } = formData;
    try {
      addUser({
        ...formData,
        user_type: 'internal',
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(dayjs());

  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
  };

  const handleChangeEndDate = (newValue: Dayjs | null) => {
    setEndDateValue(newValue);
  };

  const onToggleAutoResponse = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Auto Response
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Settings</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Auto Response</Typography>
      </Box>

      <Grid width="auto" container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={userInternalSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, control, watch, formState, setValue }) => (
            <>
              <Card
                sx={{
                  mt: 2,
                  px: 4,
                  py: 6,
                  boxShadow: '2',
                  position: 'relative',
                  backgroundColor: 'common.white',
                  borderRadius: 4,
                }}
              >
                <Grid container spacing={3} xs={12}>
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        width: '100%',
                      }}
                    >
                      <FormControlLabel
                        control={<Switch onChange={onToggleAutoResponse} />}
                        label="Turn on Auto-Response"
                      />
                    </Box>
                  </Grid>

                  {isActive && (
                    <>
                      <Grid item xs={12} md={12}>
                        <FormControl sx={{ width: '100%' }}>
                          <Typography mb={1} component="label" htmlFor="period">
                            Active Period
                          </Typography>

                          <Select
                            value={currentPeriod}
                            sx={{
                              height: 54,
                              paddingY: 0.5,
                              borderWidth: 0,
                              borderRadius: 1.5,
                              width: '100%',

                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 1,
                              },
                              '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                  // border: 'none',
                                },
                            }}
                            onChange={(e: SelectChangeEvent<string>) => {
                              setCurrentPeriod(e.target.value);
                            }}
                            id="period"
                          >
                            {['Outside Working Hours', 'Custom Period']?.map((value) => (
                              <MenuItem value={value}>{capitalize(`${value}`)}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormHelperText
                          sx={{
                            mt: 2,
                            color: 'grey.600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <SvgColor src="/assets/icons/ic-info.svg" width={13} height={13} />
                          When &apos;Outside Working Hours&apos; is selected, the auto-response will
                          be active on weekdays from 17:00 - 07:59, and all day on weekends.
                        </FormHelperText>
                        {formState?.errors?.email && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.email?.message)}
                          </FormHelperText>
                        )}
                      </Grid>

                      {currentPeriod === 'Custom Period' && (
                        <Grid item xs={12} md={12}>
                          <Box
                            mt={4}
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
                        </Grid>
                      )}

                      <Grid item xs={12} md={12}>
                        <FormControl sx={{ width: '100%' }}>
                          <Typography mb={1} component="label" htmlFor="content">
                            Automated Response
                          </Typography>

                          <OutlinedInput
                            {...register('content', {
                              required: 'Automated Response Name must be filled out',
                            })}
                            id="content"
                            placeholder="Enter your automated response message here."
                            sx={{ width: '100%' }}
                            multiline
                            rows={3}
                          />
                        </FormControl>

                        {formState?.errors?.content && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.content?.message)}
                          </FormHelperText>
                        )}
                      </Grid>

                      {currentPeriod === 'Custom Period' && (
                        <Grid item xs={12} md={12}>
                          <FormControl sx={{ width: '100%' }}>
                            <Typography mb={1} component="label" htmlFor="reason">
                              Reason for Enabling Auto-Response
                            </Typography>

                            <OutlinedInput
                              {...register('reason')}
                              id="content"
                              placeholder="ex. Annual leave"
                              sx={{ width: '100%' }}
                            />
                          </FormControl>

                          {formState?.errors?.reason && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {String(formState?.errors?.reason?.message)}
                            </FormHelperText>
                          )}
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </Card>

              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 4,
                }}
              >
                <LoadingButton
                  size="small"
                  loading={isLoading}
                  loadingIndicator="Submitting..."
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    width: 120,
                  }}
                >
                  Save
                </LoadingButton>
              </Box>
            </>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
