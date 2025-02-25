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
import { useAddAutoResponse } from 'src/services/auto-response/use-auto-response';
import {
  AutoResponseDTO,
  autoResponseSchema,
} from 'src/services/auto-response/schemas/auto-response-schema';
import { useParams } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';

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

const periodOptions = [
  {
    is_custom: 'false',
    label: 'Outside Working Hours',
  },
  {
    is_custom: 'true',
    label: 'Custom Period',
  },
];

export function AutoResponseView() {
  const { user } = useAuth();
  const { vendor } = useParams();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const [isCustom, setIsCustom] = useState('false');

  const [isActive, setIsActive] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(null);

  const { mutate: addAutoResponse } = useAddAutoResponse();

  const handleSubmit = (formData: AutoResponseDTO) => {
    setIsLoading(true);
    const payload = {
      ...formData,
      company_id: String(idCurrentCompany),
      is_custom: isCustom === 'true',
    };
    if (isCustom === 'true') {
      Object.assign(payload, {
        start_date: dateValue?.format('YYYY-MM-DD hh:mm'),
        end_date: endDateValue?.format('YYYY-MM-DD hh:mm'),
      });
    }
    try {
      addAutoResponse(payload);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

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
        <Form width="100%" onSubmit={handleSubmit} schema={autoResponseSchema}>
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
                          <Typography mb={1} component="label" htmlFor="is_custom">
                            Active Period
                          </Typography>

                          <Select
                            value={isCustom}
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
                              setIsCustom(e.target.value);
                            }}
                            id="is_custom"
                          >
                            {periodOptions?.map((value) => (
                              <MenuItem value={value?.is_custom}>
                                {capitalize(`${value?.label}`)}
                              </MenuItem>
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

                      {isCustom === 'true' && (
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
                          <Typography mb={1} component="label" htmlFor="message">
                            Automated Response
                          </Typography>

                          <OutlinedInput
                            {...register('message', {
                              required: 'Automated Response Name must be filled out',
                            })}
                            id="message"
                            placeholder="Enter your automated response message here."
                            sx={{ width: '100%' }}
                            multiline
                            rows={3}
                          />
                        </FormControl>

                        {formState?.errors?.message && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.message?.message)}
                          </FormHelperText>
                        )}
                      </Grid>

                      {isCustom === 'true' && (
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
