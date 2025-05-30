/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */
import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  capitalize,
  Divider,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from '@mui/material';
import type { Dayjs } from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form } from 'src/components/form/form';
import { useAuth } from 'src/sections/auth/providers/auth';
import type { ReportWorkAllocationDTO } from 'src/services/report/work-allocation/schemas/work-allocation-schema';
import { useReportWorkAllocation } from 'src/services/report/work-allocation/use-report-work-allocation';
import ReportWorkAllocationPDF from './report-pdf';

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

export function ReportWorkAllocationView() {
  const navigate = useNavigate();
  const { vendor } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const [timePeriod, setTimePeriod] = useState('month');
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(null);
  const { mutate: generateReportWorkAllocation, data: reportData } = useReportWorkAllocation();
  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
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

  const handleChangeEndDate = (newValue: Dayjs | null) => {
    setEndDateValue(newValue);
  };

  const handleSubmit = (formData: ReportWorkAllocationDTO) => {
    console.log(formData, 'log: formData report request');
    // setIsLoading(true);
    const payload = {
      internalCompanyId: String(idCurrentCompany),
      period: timePeriod ?? '',
    };
    if (timePeriod === 'custom') {
      Object.assign(payload, {
        from: dateValue?.format('YYYY-MM-DD hh:mm'),
        to: endDateValue?.format('YYYY-MM-DD hh:mm'),
      });
    }
    try {
      generateReportWorkAllocation(payload);
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
                <Typography>Work Allocation</Typography>
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
                  Work Allocation
                </Typography>
              </Box>

              <Divider sx={{ mt: 2, borderStyle: 'dashed' }} />

              <Box p={2}>
                <Form
                  width="100%"
                  onSubmit={handleSubmit}
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

                      <Box mt={24}>
                        <Button sx={{ width: '100%' }} type="submit" variant="contained">
                          Generate & Download Report
                        </Button>
                        <ReportWorkAllocationPDF
                          timePeriod={timePeriod}
                          startDate={dateValue}
                          endDate={endDateValue}
                          vendor={vendor?.toUpperCase() ?? ''}
                          data={{
                            summary: reportData?.data?.summary,
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
