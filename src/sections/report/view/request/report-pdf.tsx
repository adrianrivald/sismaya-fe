import { Box, Typography, capitalize } from '@mui/material';
import type { OpUnitType } from 'dayjs';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
  hiddenRef: any;
  vendor: string;
  timePeriod: string;
}

const ReportRequestPDF = ({ data, hiddenRef, vendor, timePeriod }: ReportProps) => {
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

  return (
    <div>
      <div
        ref={hiddenRef}
        style={{ position: 'absolute', left: '-99300px', padding: '20px', width: '900px' }}
      >
        {/* <div ref={hiddenRef} style={{ padding: '20px', width: '900px' }}> */}
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography fontSize={20} fontWeight="bold">
              Request Log Report
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
            <Typography mb={3} fontSize={24}>
              A. SUMMARY REPORT
            </Typography>
            <Box mb={4}>
              <Typography mb={1}>
                {' '}
                1. TOTAL REQUESTS FROM {data?.reportData?.report_per_year[0]?.period_name} TO{' '}
                {data?.reportData?.report_per_year[1]?.period_name}
              </Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Period</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.report_per_year?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.period_name}
                      </td>
                      <td style={cellStyle}>{row?.request_count}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={cellStyle} />
                    <td style={cellStyle} align="center">
                      <strong>Total</strong>
                    </td>

                    <td style={cellStyle} align="center">
                      <strong>
                        {data?.reportData?.report_per_year?.reduce(
                          (a: any, b: any) => a.request_count + b.request_count
                        )}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
            <Box my={4}>
              <Typography mb={1}>2. TOTAL REQUEST PER MONTH</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Period</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.report_per_month?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.period_name}
                      </td>
                      <td style={cellStyle}>{row?.request_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Box my={4}>
              <Typography mb={1}>3. TOTAL REQUEST PER CATEGORY</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Category</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.report_per_category?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.category_name}
                      </td>
                      <td style={cellStyle}>{row?.request_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Box my={4}>
              <Typography mb={1}>3. TOTAL REQUEST PER PRIORITY</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Priority</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.report_per_priority?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.priority_name}
                      </td>
                      <td style={cellStyle}>{row?.request_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Box my={4}>
              <Typography mb={1}>4. TOTAL REQUEST PER STATUS</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Status</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.report_per_status?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.progress_status_name}
                      </td>
                      <td style={cellStyle}>{row?.request_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Box my={4}>
              <Typography mb={1}>5. TOTAL REQUEST PER DIVISION</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Division</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.report_per_division?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.department_name}
                      </td>
                      <td style={cellStyle}>{row?.request_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Box my={4}>
              <Typography mb={1}>5. TOTAL REQUEST PER COMPANY</Typography>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Company</th>
                    <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reportData?.report_per_company?.map((row: any, indexItem: number) => (
                    <tr key={indexItem + 1}>
                      <td style={cellStyle}>{indexItem + 1}</td>
                      <td style={cellStyle} align="left">
                        {row?.company_name}
                      </td>
                      <td style={cellStyle}>{row?.request_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReportRequestPDF;
