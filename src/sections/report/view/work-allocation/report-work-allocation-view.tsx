/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
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
import type { Dayjs, OpUnitType } from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form } from 'src/components/form/form';
import { useAuth } from 'src/sections/auth/providers/auth';
import type { ReportWorkAllocationDTO } from 'src/services/report/work-allocation/schemas/work-allocation-schema';
import { useReportWorkAllocation } from 'src/services/report/work-allocation/use-report-work-allocation';
import dayjs from 'dayjs';
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

  // Helper: Convert image URL to base64
  const loadImageAsBase64 = (url: string): Promise<string | null> =>
    new Promise((resolve) => {
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const renderPeriod = (period: string) => {
    const getFullMonthRange = (range: OpUnitType) => {
      const startOfMonth = dayjs().startOf(range);
      const endOfMonth = dayjs().endOf(range);

      return `${startOfMonth.format('D MMMM YYYY')} - ${endOfMonth.format('D MMMM YYYY')}`;
    };
    const getLastXDaysRange = (x: number) => {
      const endDateValueRange = dayjs(); // today
      const startDateValue = endDateValueRange.subtract(x, 'day'); // include today in the 30 days

      return `${startDateValue.format('D MMMM YYYY')} - ${endDateValueRange.format('D MMMM YYYY')}`;
    };

    const getLastXFullMonthsRange = (x: number) => {
      const endDateValueRange = dayjs();
      const startDateValue = dayjs().subtract(x, 'month');

      return `${startDateValue.format('D MMMM YYYY')} - ${endDateValueRange.format('D MMMM YYYY')}`;
    };
    if (period !== 'custom') {
      switch (period) {
        case 'month':
          return getFullMonthRange('month');
        case 'year':
          return getFullMonthRange('year');
        case '30-days':
          return getLastXDaysRange(30);
        case '3-months':
          return getLastXFullMonthsRange(3);
        case '6-months':
          return getLastXFullMonthsRange(6);

        default:
          return '';
          break;
      }
    }
    return `${dateValue?.format('D MMMM YYYY')} - ${endDateValue?.format('D MMMM YYYY')}`;
  };
  const generatePdf = async () => {
    const element = hiddenRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const headerHeight = 60;
    const footerHeight = 30;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgHeight = (pdfWidth * canvasHeight) / canvasWidth;

    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;
    const totalPages = Math.ceil(imgHeight / (pdfHeight - headerHeight - footerHeight));

    const logoImg = await loadImageAsBase64(reportData?.meta?.company_image);

    const addHeaderFooter = () => {
      // Header
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0);
      pdf.text(`PT ${vendor} Work Allocation Report`, 20, 30);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100);
      pdf.text(renderPeriod(timePeriod), 20, 45);

      // Logo (right side)
      if (logoImg) {
        const imgWidth = 60;
        const logoHeight = 60;
        pdf.addImage(logoImg, 'PNG', pdfWidth - imgWidth - 40, 20, imgWidth, logoHeight);
      }

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(`Page ${pageNumber} of ${totalPages}`, pdfWidth - 100, pdfHeight - 15);
    };

    // First page
    pdf.addImage(imgData, 'PNG', 0, headerHeight, pdfWidth, imgHeight);
    addHeaderFooter();
    heightLeft -= pdfHeight - headerHeight - footerHeight;

    // Additional pages
    while (heightLeft > 0) {
      pageNumber++;
      pdf.addPage();
      position = heightLeft - imgHeight + headerHeight;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      addHeaderFooter();
      heightLeft -= pdfHeight - headerHeight - footerHeight;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
