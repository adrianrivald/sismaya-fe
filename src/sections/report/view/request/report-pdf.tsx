import { Box, Typography, capitalize } from '@mui/material';
import type { Dayjs, OpUnitType } from 'dayjs';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
  hiddenRef: any;
  vendor: string;
  timePeriod: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const ReportRequestPDF = ({
  data,
  hiddenRef,
  vendor,
  timePeriod,
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
          {data?.reportData?.summary && (
            <Box width="100%">
              <Typography mb={3} fontSize={24}>
                A. SUMMARY REPORT
              </Typography>
              <Box mb={4}>
                <Typography mb={1}>
                  {' '}
                  1. TOTAL REQUESTS FROM{' '}
                  {data?.reportData?.summary?.report_per_year[0]?.period_name} TO{' '}
                  {data?.reportData?.summary?.report_per_year[1]?.period_name}
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
                    {data?.reportData?.summary?.report_per_year?.map(
                      (row: any, indexItem: number) => (
                        <tr key={indexItem + 1}>
                          <td style={cellStyle}>{indexItem + 1}</td>
                          <td style={cellStyle} align="left">
                            {row?.period_name}
                          </td>
                          <td style={cellStyle}>{row?.request_count}</td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td style={cellStyle} />
                      <td style={cellStyle} align="center">
                        <strong>Total</strong>
                      </td>

                      <td style={cellStyle} align="center">
                        <strong>
                          {data?.reportData?.summary?.report_per_year?.reduce(
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
                    {data?.reportData?.summary?.report_per_month?.map(
                      (row: any, indexItem: number) => (
                        <tr key={indexItem + 1}>
                          <td style={cellStyle}>{indexItem + 1}</td>
                          <td style={cellStyle} align="left">
                            {row?.period_name}
                          </td>
                          <td style={cellStyle}>{row?.request_count}</td>
                        </tr>
                      )
                    )}
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
                    {data?.reportData?.summary?.report_per_category?.map(
                      (row: any, indexItem: number) => (
                        <tr key={indexItem + 1}>
                          <td style={cellStyle}>{indexItem + 1}</td>
                          <td style={cellStyle} align="left">
                            {row?.category_name}
                          </td>
                          <td style={cellStyle}>{row?.request_count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Box>
              <Box my={4}>
                <Typography mb={1}>4. TOTAL REQUEST PER PRIORITY</Typography>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Priority</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.reportData?.summary?.report_per_priority?.map(
                      (row: any, indexItem: number) => (
                        <tr key={indexItem + 1}>
                          <td style={cellStyle}>{indexItem + 1}</td>
                          <td style={cellStyle} align="left">
                            {row?.priority_name}
                          </td>
                          <td style={cellStyle}>{row?.request_count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Box>
              <Box my={4}>
                <Typography mb={1}>5. TOTAL REQUEST PER STATUS</Typography>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Status</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.reportData?.summary?.report_per_status?.map(
                      (row: any, indexItem: number) => (
                        <tr key={indexItem + 1}>
                          <td style={cellStyle}>{indexItem + 1}</td>
                          <td style={cellStyle} align="left">
                            {row?.progress_status_name}
                          </td>
                          <td style={cellStyle}>{row?.request_count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Box>

              <Box my={4}>
                <Typography mb={1}>6. TOTAL REQUEST PER DIVISION</Typography>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Division</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.reportData?.summary?.report_per_division?.map(
                      (row: any, indexItem: number) => (
                        <tr key={indexItem + 1}>
                          <td style={cellStyle}>{indexItem + 1}</td>
                          <td style={cellStyle} align="left">
                            {row?.department_name}
                          </td>
                          <td style={cellStyle}>{row?.request_count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Box>

              <Box my={4}>
                <Typography mb={1}>7. TOTAL REQUEST PER COMPANY</Typography>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>No.</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Company</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Total Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.reportData?.summary?.report_per_company?.map(
                      (row: any, indexItem: number) => (
                        <tr key={indexItem + 1}>
                          <td style={cellStyle}>{indexItem + 1}</td>
                          <td style={cellStyle} align="left">
                            {row?.company_name}
                          </td>
                          <td style={cellStyle}>{row?.request_count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Box>

              {data?.reportData?.summary?.report_company_detail?.map(
                (detail: any, index: number) => {
                  const grouped = [];
                  for (let i = 0; i < detail?.report_per_category.length; i += 2) {
                    grouped.push([
                      detail?.report_per_category[i],
                      detail?.report_per_category[i + 1],
                    ]);
                  }
                  const groupedDepartment = [];
                  for (let i = 0; i < detail?.report_per_division.length; i += 2) {
                    groupedDepartment.push([
                      detail?.report_per_division[i],
                      detail?.report_per_division[i + 1],
                    ]);
                  }
                  const groupedStatus = [];
                  for (let i = 0; i < detail?.report_per_status.length; i += 2) {
                    groupedStatus.push([
                      detail?.report_per_status[i],
                      detail?.report_per_status[i + 1],
                    ]);
                  }
                  return (
                    <Box my={4}>
                      <Typography mb={1}>
                        7.{index + 1} {detail?.company_name}
                      </Typography>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={{ ...subHeaderStyle, ...cellStyle }} colSpan={4}>
                              Request by Priority
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {' '}
                          <tr>
                            <td style={cellStyle}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span style={{ fontSize: 'normal' }}>CITO</span>
                                <span>
                                  {
                                    detail?.report_per_priority?.find(
                                      (item: { priority_name: string }) =>
                                        item?.priority_name === 'Cito'
                                    ).request_count
                                  }
                                </span>
                              </div>
                            </td>
                            <td style={cellStyle}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span style={{ fontSize: 'normal' }}>Medium</span>
                                <span>
                                  {
                                    detail?.report_per_priority?.find(
                                      (item: { priority_name: string }) =>
                                        item?.priority_name === 'High'
                                    ).request_count
                                  }
                                </span>
                              </div>
                            </td>
                            <td style={cellStyle}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span style={{ fontSize: 'normal' }}>Medium</span>
                                <span>
                                  {
                                    detail?.report_per_priority?.find(
                                      (item: { priority_name: string }) =>
                                        item?.priority_name === 'Medium'
                                    ).request_count
                                  }
                                </span>
                              </div>
                            </td>
                            <td style={cellStyle}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span style={{ fontSize: 'normal' }}>Low</span>
                                <span>
                                  {
                                    detail?.report_per_priority?.find(
                                      (item: { priority_name: string }) =>
                                        item?.priority_name === 'Low'
                                    ).request_count
                                  }
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={cellStyle} colSpan={3} />

                            <td style={cellStyle}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span style={{ fontSize: 'normal' }}>Total</span>
                                <span>{detail?.report_per_priority_total ?? 0}</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={{ ...subHeaderStyle, ...cellStyle }} colSpan={4}>
                              Request by Category
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {' '}
                          {grouped.map((pair, groupIndex) => (
                            <tr key={groupIndex}>
                              {pair?.map((pairItem) => (
                                <td style={cellStyle}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ fontSize: 'normal' }}>
                                      {pairItem?.category_name}
                                    </span>
                                    <span>{pairItem?.request_count}</span>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                          {/* <tr>
                            <td style={cellStyle} colSpan={3} />

                            <td style={cellStyle}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span style={{ fontSize: 'normal' }}>Total</span>
                                <span>{detail?.report_per_priority_total ?? 0}</span>
                              </div>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={{ ...subHeaderStyle, ...cellStyle }} colSpan={4}>
                              Request by Division
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {' '}
                          {groupedDepartment?.map((pair, groupIndex) => (
                            <tr key={groupIndex}>
                              {pair?.map((pairItem) => (
                                <td style={cellStyle}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ fontSize: 'normal' }}>
                                      {pairItem?.department_name}
                                    </span>
                                    <span>{pairItem?.request_count}</span>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <table style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={{ ...subHeaderStyle, ...cellStyle }} colSpan={4}>
                              Request by Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {' '}
                          {groupedStatus?.map((pair, groupIndex) => (
                            <tr key={groupIndex}>
                              {pair?.map((pairItem) => (
                                <td style={cellStyle}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span style={{ fontSize: 'normal' }}>
                                      {pairItem?.progress_status_name}
                                    </span>
                                    <span>{pairItem?.request_count}</span>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  );
                }
              )}
            </Box>
          )}
        </Box>
        {data?.reportData?.detail?.length > 0 && (
          <Box mt={4} display="flex" width="100%" justifyContent="space-between" gap={4}>
            <Box width="100%">
              <Typography mb={3} fontSize={24}>
                B. DETAILED REQUEST REPORT
              </Typography>
              <Box mb={4}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} rowSpan={2}>
                        No.
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} rowSpan={2}>
                        Date Requested
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} align="left" rowSpan={2}>
                        Product & Request Title
                        <br />
                        <span style={{ color: '#637381', fontSize: '14px' }}>Request ID</span>
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} align="left" rowSpan={2}>
                        Client
                        <br />
                        <span style={{ color: '#637381', fontSize: '14px' }}>Division</span>
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} rowSpan={2}>
                        Category
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} rowSpan={2}>
                        Total Manpower
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} colSpan={2}>
                        Work Duration Hours
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} rowSpan={2}>
                        Priority
                      </th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }} rowSpan={2}>
                        Status
                      </th>
                    </tr>
                    <tr>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Expected</th>
                      <th style={{ ...subHeaderStyle, ...cellStyle }}>Actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.reportData?.detail?.map((row: any, indexItem: number) => (
                      <tr key={indexItem + 1}>
                        <td style={cellStyle}>{indexItem + 1}</td>
                        <td style={cellStyle} align="left">
                          <div>{dayjs(row?.requested_data).format('DD-MM-YYYY')}</div>
                          <div>{dayjs(row?.requested_data).format('hh:mm:ss')}</div>
                        </td>
                        <td style={cellStyle} align="left">
                          <div>{row?.product_name}</div>
                          <div style={{ color: '#637381', fontSize: '14px' }}>
                            {row?.request_number}
                          </div>
                        </td>
                        <td style={cellStyle} align="left">
                          <div>{row?.client_company_name}</div>
                          <div style={{ color: '#637381', fontSize: '14px' }}>
                            {row?.client_division}
                          </div>
                        </td>
                        <td style={cellStyle}>{row?.category_name}</td>
                        <td style={cellStyle}>{row?.total_manpower}</td>
                        <td style={cellStyle}>{row?.estimation_expected}</td>
                        <td style={cellStyle}>{row?.estimation_actual}</td>
                        <td style={cellStyle}>{row?.priority}</td>
                        <td style={cellStyle}>{row?.status_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
};

export default ReportRequestPDF;
