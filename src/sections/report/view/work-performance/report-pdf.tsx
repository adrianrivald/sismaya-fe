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
import type { OpUnitType } from 'dayjs';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
  hiddenRef: any;
  vendor: string;
  timePeriod: string;
  reportType: string;
}

const ReportWorkPerformancePDF = ({
  data,
  hiddenRef,
  vendor,
  timePeriod,
  reportType,
}: ReportProps) => {
  console.log(data, 'datadatadata');
  const renderPeriod = (period: string) => {
    const getFullMonthRange = (range: OpUnitType) => {
      const startOfMonth = dayjs().startOf(range);
      const endOfMonth = dayjs().endOf(range);

      return `${startOfMonth.format('D MMMM YYYY')} - ${endOfMonth.format('D MMMM YYYY')}`;
    };
    const getLastXDaysRange = (x: number) => {
      const endDate = dayjs(); // today
      const startDate = endDate.subtract(x, 'day'); // include today in the 30 days

      return `${startDate.format('D MMMM YYYY')} - ${endDate.format('D MMMM YYYY')}`;
    };

    const getLastXFullMonthsRange = (x: number) => {
      const endDate = dayjs();
      const startDate = dayjs().subtract(x, 'month');

      return `${startDate.format('D MMMM YYYY')} - ${endDate.format('D MMMM YYYY')}`;
    };
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
        <Box>
          <Typography fontSize={20} fontWeight="bold">
            Employee Performance Report: {capitalize(reportType)} Performance
          </Typography>
          <Typography mt={1} color="grey.600">
            {renderPeriod(timePeriod)}
          </Typography>
        </Box>
        <Box mt={4} display="flex" width="100%" justifyContent="space-between" gap={4}>
          <Box width="50%">
            {data?.reportData?.map((report: any, index: number) => (
              <Box mb={4}>
                <Typography mb={1}>
                  {index + 1}. {report?.employee}
                </Typography>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th colSpan={4} style={headerStyle}>
                        {report?.employee}&apos;s Monthly Performance
                      </th>
                    </tr>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Period</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Tasks</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report?.performance_report?.map((row: any, indexItem: number) => (
                      <tr key={indexItem + 1}>
                        <td style={cellStyle}>{indexItem + 1}</td>
                        <td style={cellStyle}>{row.period_name}</td>
                        <td style={cellStyle}>{row.task_count}</td>
                        <td style={cellStyle}>{row.working_hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table style={{ ...tableStyle, marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th colSpan={4} style={headerStyle}>
                        {report?.employee}&apos;s Work Distribution
                      </th>
                    </tr>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Product</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Tasks</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report?.distribution_report?.map((row: any, indexItem: number) => (
                      <tr key={indexItem + 1}>
                        <td style={cellStyle}>{indexItem + 1}</td>
                        <td style={cellStyle}>{row.product_name}</td>
                        <td style={cellStyle}>{row.task_count}</td>
                        <td style={cellStyle}>{row.working_hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReportWorkPerformancePDF;
