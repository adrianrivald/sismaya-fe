import {
  Box,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  capitalize,
} from '@mui/material';
import type { Dayjs, OpUnitType } from 'dayjs';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
  hiddenRef: any;
  vendor: string;
  timePeriod: string;
  reportType: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const ReportWorkPerformanceOverallPDF = ({
  data,
  hiddenRef,
  vendor,
  timePeriod,
  reportType,
  startDate,
  endDate,
}: ReportProps) => {
  const renderPeriod = (period: string) => {
    const getFullMonthRange = (range: OpUnitType) => {
      const startOfMonth = dayjs().startOf(range);
      const endOfMonth = dayjs().endOf(range);

      return `${startOfMonth.format('D MMMM YYYY')} - ${endOfMonth.format('D MMMM YYYY')}`;
    };
    const getLastXDaysRange = (x: number) => {
      const endDateValue = dayjs(); // today
      const startDateValue = endDateValue.subtract(x, 'day'); // include today in the 30 days

      return `${startDateValue.format('D MMMM YYYY')} - ${endDateValue.format('D MMMM YYYY')}`;
    };

    const getLastXFullMonthsRange = (x: number) => {
      const endDateValue = dayjs();
      const startDateValue = dayjs().subtract(x, 'month');

      return `${startDateValue.format('D MMMM YYYY')} - ${endDateValue.format('D MMMM YYYY')}`;
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
    return `${startDate?.format('D MMMM YYYY')} - ${endDate?.format('D MMMM YYYY')}`;
  };

  const tableStyle: React.CSSProperties | undefined = {
    borderCollapse: 'collapse',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    textAlign: 'center',
    margin: '20px auto',
  };

  const headerStyle = {
    backgroundColor: '#DFE3E8',
    fontWeight: 'bold',
    padding: '10px',
    border: '1px solid #ccc',
  };

  const subHeaderStyle = {
    backgroundColor: '#DFE3E8',
    padding: '8px',
  };

  const cellStyle = {
    padding: '8px',
    border: '1px solid #ccc',
  };

  return (
    <div>
      <div
        ref={hiddenRef}
        style={{ position: 'absolute', left: '-99300px', padding: '20px', width: '900px' }}
      >
        {/* <div ref={hiddenRef} style={{ padding: '20px', width: '900px', maxHeight: '100vh' }}> */}
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography fontSize={20} fontWeight="bold">
              Employee Performance Report: {capitalize(reportType)} Performance
            </Typography>
            <Typography mt={1} color="grey.600">
              {renderPeriod(timePeriod)}
            </Typography>
          </Box>
          <Box>
            <img src={data?.image} alt="logo" height={100} crossOrigin="anonymous" />
          </Box>
        </Box>

        <Box mt={4} display="flex" width="100%" justifyContent="space-between" gap={4}>
          <Box width="100%">
            <Box mb={4}>
              <Typography mb={1}>
                1. OVERALL PERFORMANCE FROM {data?.reportData?.performance_per_year[0]?.period_name}{' '}
                TO{' '}
                {
                  data?.reportData?.performance_per_year[
                    (data?.reportData?.performance_per_year?.length ?? 0) - 1
                  ]?.period_name
                }
              </Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Period</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Tasks</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Working Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.performance_per_year?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.period_name}
                      </td>
                      <td style={cellStyle}>{row?.task_count}</td>
                      <td style={cellStyle}>{row?.working_hours}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={cellStyle} />
                    <td style={cellStyle} align="center">
                      <strong>Total</strong>
                    </td>

                    <td style={cellStyle} align="center">
                      <strong>
                        {data?.reportData?.performance_per_year?.length > 1
                          ? data?.reportData?.performance_per_year?.reduce(
                              (sum: number, item: any) => sum + item.task_count,
                              0
                            )
                          : data?.reportData?.performance_per_year[0]?.task_count}
                      </strong>
                    </td>
                    <td style={cellStyle} align="center">
                      <strong>
                        {data?.reportData?.performance_per_year?.length > 1
                          ? data?.reportData?.performance_per_year?.reduce(
                              (sum: number, item: any) => sum + item.working_hours,
                              0
                            )
                          : data?.reportData?.performance_per_year[0]?.working_hours}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>

            <Box my={4}>
              <Typography mb={1}>2. EMPLOYEE PERFORMANCE OF THE MONTH</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Period</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Tasks</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Working Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.performance_per_month?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.period_name}
                      </td>
                      <td style={cellStyle}>{row?.task_count}</td>
                      <td style={cellStyle}>{row?.working_hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Box my={4}>
              <Typography mb={1}>3. EMPLOYEE PERFORMANCE PER PRODUCT</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Product</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Tasks</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Working Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.performance_per_product?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.product_name}
                      </td>
                      <td style={cellStyle}>{row?.task_count}</td>
                      <td style={cellStyle}>{row?.working_hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Box mt={4}>
              <Typography mb={1}>4. EMPLOYEE PERFORMANCE PER DIVISION</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Division</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Tasks</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Working Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.performance_per_division?.map(
                    (row: any, indexItem: number) => (
                      <tr key={indexItem + 1}>
                        <td style={cellStyle}>{indexItem + 1}</td>
                        <td style={cellStyle} align="left">
                          {row?.department_name ?? '-'}
                        </td>
                        <td style={cellStyle}>{row?.task_count}</td>
                        <td style={cellStyle}>{row?.working_hours}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReportWorkPerformanceOverallPDF;
