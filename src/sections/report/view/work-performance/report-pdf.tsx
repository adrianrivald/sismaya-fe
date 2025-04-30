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
            <TableContainer component={Paper} sx={{ maxWidth: 600, margin: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>No.</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Client</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Total Requests</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.summary?.map((row: any, index: number) => (
                    <TableRow key={index + 1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.company_name}</TableCell>
                      <TableCell align="center">{row.request_count}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell />
                    <TableCell align="center">
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>{totalRequests}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReportWorkAllocationPDF;
