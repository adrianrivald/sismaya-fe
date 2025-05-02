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
} from '@mui/material';
import type { OpUnitType } from 'dayjs';
import dayjs from 'dayjs';
import PieChart from './pie-chart';

interface ReportProps {
  data: any;
  hiddenRef: any;
  vendor: string;
  timePeriod: string;
}

const ReportWorkAllocationPDF = ({ data, hiddenRef, vendor, timePeriod }: ReportProps) => {
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

  const subHeaderStyle = {
    backgroundColor: '#DFE3E8',
    padding: '8px',
  };

  const cellStyle = {
    padding: '8px',
    border: '1px solid #ccc',
  };

  const colorMapping = ['#FFB185', '#00BCD4', '#FFD580', '#C79EFF'];

  const pieData = data?.summary?.map((client: any, index: number) => ({
    value: client.percentage,
    color: colorMapping[index],
  }));

  const totalRequests = data?.summary?.reduce((sum: any, row: any) => sum + row.request_count, 0);

  return (
    <div>
      <div
        ref={hiddenRef}
        style={{ position: 'absolute', left: '-99300px', padding: '20px', width: '900px' }}
      >
        {/* <div ref={hiddenRef} style={{ padding: '20px', width: '900px' }}> */}
        <Box>
          <Typography fontSize={20} fontWeight="bold">
            PT {vendor} Work Allocation Report
          </Typography>
          <Typography mt={1} color="grey.600">
            {renderPeriod(timePeriod)}
          </Typography>
        </Box>
        <Box mt={4} display="flex" width="100%" justifyContent="space-between" gap={4}>
          <Box width="50%" border={1} borderColor="grey.300" borderRadius={2} p={4}>
            <PieChart data={pieData} />
            <Box sx={{ borderBottom: '2px dashed #919EAB33', my: 2 }} />
            {data.summary?.map((item: any, index: number) => (
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '100%',
                    backgroundColor: colorMapping[index],
                  }}
                />
                <Typography>{item.company_name}</Typography>
              </Box>
            ))}
          </Box>
          <Box width="50%">
            <Typography mb={2}>Total Work allocation per Client</Typography>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                  <th style={{ ...subHeaderStyle, ...cellStyle }}>Client</th>
                  <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                </tr>
              </thead>
              <tbody>
                {data.summary?.map((row: any, indexItem: number) => (
                  <tr key={indexItem + 1}>
                    <td style={cellStyle}>{indexItem + 1}</td>
                    <td style={cellStyle}>{row.company_name}</td>
                    <td style={cellStyle}>{row.request_count}</td>
                  </tr>
                ))}

                <tr>
                  <td style={cellStyle} />
                  <td style={cellStyle} align="center">
                    <strong>Total</strong>
                  </td>
                  <td style={cellStyle} align="center">
                    <strong>{totalRequests}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReportWorkAllocationPDF;
