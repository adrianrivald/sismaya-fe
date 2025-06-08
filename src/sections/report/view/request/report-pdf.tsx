import { capitalize } from '@mui/material';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Dayjs, OpUnitType } from 'dayjs';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
  timePeriod: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const ReportRequestPDF = ({ data, timePeriod, startDate, endDate }: ReportProps) => {
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

  // Helper styles
  const styles = StyleSheet.create({
    page: {
      paddingTop: 40, // leave space for header
      paddingBottom: 40, // leave space for footer
      paddingHorizontal: 20,
      fontSize: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingBottom: 10,
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000',
    },
    subtitle: {
      fontSize: 10,
      color: '#666',
      marginTop: 4,
    },
    logo: {
      width: 50,
      height: 80,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: 'center',
      fontSize: 10,
      color: 'gray',
      borderTop: '1pt solid #aaa',
      paddingTop: 5,
    },
    section: {
      marginBottom: 16,
    },
    table: {
      display: 'flex',
      width: 'auto',
      marginTop: 8,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableColHeader: {
      fontWeight: 'bold',
      backgroundColor: '#DFE3E8',
      padding: 8,
    },
    tableCol: {
      padding: 8,
    },
    cell: {
      width: '25%',
      border: '1px solid #ccc',
      padding: 8,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Request Log Report</Text>
            <Text style={styles.subtitle}>{renderPeriod(timePeriod)}</Text>
          </View>

          {data?.image && <Image src={data.image} style={styles.logo} />}
        </View>
        <View wrap>
          <View style={styles.section}>
            {data?.reportData?.summary && (
              <>
                <View style={{ width: '100%' }}>
                  <Text style={{ width: '100%' }}>
                    <View style={{ paddingBottom: 2, borderBottom: 1, borderBottomColor: 'grey' }}>
                      <Text style={{ fontSize: '14px' }}>A. SUMMARY REPORT</Text>
                    </View>
                  </Text>
                </View>
                {/* 1 */}
                <View style={{ width: '100%', marginTop: '8px' }}>
                  <Text style={{ marginVertical: 1 }}>
                    {' '}
                    1. TOTAL REQUESTS FROM{' '}
                    {data?.reportData?.summary?.report_per_year[0]?.period_name} TO{' '}
                    {data?.reportData?.summary?.report_per_year[1]?.period_name}
                  </Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '60%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Period
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '30%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Requests
                    </Text>
                  </View>
                  {data?.reportData?.summary?.report_per_year?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={{ ...styles.cell, width: '10%', textAlign: 'center' }}>
                        {i + 1}
                      </Text>
                      <Text style={{ ...styles.cell, width: '60%' }}>{row.period_name}</Text>
                      <Text style={{ ...styles.cell, width: '30%', textAlign: 'center' }}>
                        {row.request_count}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.tableRow}>
                    <Text style={{ ...styles.cell, width: '10%' }} />
                    <Text
                      style={{
                        ...styles.cell,
                        width: '60%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Total
                    </Text>
                    <Text
                      style={{
                        ...styles.cell,
                        width: '30%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {data?.reportData?.summary?.report_per_year?.length > 1
                        ? data?.reportData?.summary?.report_per_year?.reduce(
                            (sum: number, item: any) => sum + item.task_count,
                            0
                          )
                        : data?.reportData?.summary?.report_per_year[0]?.task_count}
                    </Text>
                  </View>
                </View>

                {/* 2 */}
                <View style={{ width: '100%', marginTop: '8px' }}>
                  <Text style={{ marginVertical: 1 }}>2. TOTAL REQUEST PER MONTH</Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '60%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Period
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '30%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Requests
                    </Text>
                  </View>
                  {data?.reportData?.summary?.report_per_month?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={{ ...styles.cell, width: '10%', textAlign: 'center' }}>
                        {i + 1}
                      </Text>
                      <Text style={{ ...styles.cell, width: '60%' }}>{row.period_name}</Text>
                      <Text style={{ ...styles.cell, width: '30%', textAlign: 'center' }}>
                        {row.request_count}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* 3 */}
                <View style={{ width: '100%', marginTop: '8px' }}>
                  <Text style={{ marginVertical: 1 }}>3. TOTAL REQUEST PER CATEGORY</Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '60%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Category
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '30%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Requests
                    </Text>
                  </View>
                  {data?.reportData?.summary?.report_per_category?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={{ ...styles.cell, width: '10%', textAlign: 'center' }}>
                        {i + 1}
                      </Text>
                      <Text style={{ ...styles.cell, width: '60%' }}>{row.category_name}</Text>
                      <Text style={{ ...styles.cell, width: '30%', textAlign: 'center' }}>
                        {row.request_count}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* 4 */}
                <View style={{ width: '100%', marginTop: '8px' }}>
                  <Text style={{ marginVertical: 1 }}>4. TOTAL REQUEST PER PRIORITY</Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '60%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Priority
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '30%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Requests
                    </Text>
                  </View>
                  {data?.reportData?.summary?.report_per_priority?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={{ ...styles.cell, width: '10%', textAlign: 'center' }}>
                        {i + 1}
                      </Text>
                      <Text style={{ ...styles.cell, width: '60%' }}>{row.priority_name}</Text>
                      <Text style={{ ...styles.cell, width: '30%', textAlign: 'center' }}>
                        {row.request_count}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* 5 */}
                <View style={{ width: '100%', marginTop: '8px' }}>
                  <Text style={{ marginVertical: 1 }}>5. TOTAL REQUEST PER STATUS</Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '60%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Status
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '30%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Requests
                    </Text>
                  </View>
                  {data?.reportData?.summary?.report_per_status?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={{ ...styles.cell, width: '10%', textAlign: 'center' }}>
                        {i + 1}
                      </Text>
                      <Text style={{ ...styles.cell, width: '60%' }}>
                        {row.progress_status_name}
                      </Text>
                      <Text style={{ ...styles.cell, width: '30%', textAlign: 'center' }}>
                        {row.request_count}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* 6 */}
                <View style={{ width: '100%', marginTop: '8px' }}>
                  <Text style={{ marginVertical: 1 }}>6. TOTAL REQUEST PER DIVISION</Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '60%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Division
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '30%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Requests
                    </Text>
                  </View>
                  {data?.reportData?.summary?.report_per_division?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={{ ...styles.cell, width: '10%', textAlign: 'center' }}>
                        {i + 1}
                      </Text>
                      <Text style={{ ...styles.cell, width: '60%' }}>
                        {row.progress_status_name}
                      </Text>
                      <Text style={{ ...styles.cell, width: '30%', textAlign: 'center' }}>
                        {row.request_count}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* 7 */}
                <View style={{ width: '100%', marginTop: '8px' }}>
                  <Text style={{ marginVertical: 1 }}>7. TOTAL REQUEST PER COMPANY</Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '60%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Company
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '30%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Requests
                    </Text>
                  </View>
                  {data?.reportData?.summary?.report_per_company?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={{ ...styles.cell, width: '10%', textAlign: 'center' }}>
                        {i + 1}
                      </Text>
                      <Text style={{ ...styles.cell, width: '60%' }}>{row.company_name}</Text>
                      <Text style={{ ...styles.cell, width: '30%', textAlign: 'center' }}>
                        {row.request_count}
                      </Text>
                    </View>
                  ))}
                </View>

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
                      <>
                        <View style={{ width: '100%', marginTop: '8px' }}>
                          <Text style={{ marginVertical: 1 }}>
                            {' '}
                            7.{index + 1} {detail?.company_name}
                          </Text>
                        </View>

                        <View style={styles.table}>
                          <View style={styles.tableRow}>
                            <Text
                              style={[
                                { ...styles.cell, width: '100%', textAlign: 'center' },
                                styles.tableColHeader,
                              ]}
                            >
                              Request by Priority
                            </Text>
                          </View>
                          <View style={styles.tableRow}>
                            <View
                              style={{
                                ...styles.cell,
                                flexDirection: 'row',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '25%',
                                textAlign: 'center',
                              }}
                            >
                              <Text>CITO</Text>
                              <Text>
                                {
                                  detail?.report_per_priority?.find(
                                    (item: { priority_name: string }) =>
                                      item?.priority_name === 'Cito'
                                  ).request_count
                                }
                              </Text>
                            </View>{' '}
                            <View
                              style={{
                                ...styles.cell,
                                flexDirection: 'row',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '25%',
                                textAlign: 'center',
                              }}
                            >
                              <Text>High</Text>
                              <Text>
                                {
                                  detail?.report_per_priority?.find(
                                    (item: { priority_name: string }) =>
                                      item?.priority_name === 'High'
                                  ).request_count
                                }
                              </Text>
                            </View>
                            <View
                              style={{
                                ...styles.cell,
                                flexDirection: 'row',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '25%',
                                textAlign: 'center',
                              }}
                            >
                              <Text>Medium</Text>
                              <Text>
                                {
                                  detail?.report_per_priority?.find(
                                    (item: { priority_name: string }) =>
                                      item?.priority_name === 'Medium'
                                  ).request_count
                                }
                              </Text>
                            </View>
                            <View
                              style={{
                                ...styles.cell,
                                flexDirection: 'row',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '25%',
                                textAlign: 'center',
                              }}
                            >
                              <Text>Low</Text>
                              <Text>
                                {
                                  detail?.report_per_priority?.find(
                                    (item: { priority_name: string }) =>
                                      item?.priority_name === 'Low'
                                  ).request_count
                                }
                              </Text>
                            </View>
                          </View>
                          <View style={styles.tableRow}>
                            <Text style={{ ...styles.cell, width: '75%' }} />
                            <View
                              style={{
                                ...styles.cell,
                                flexDirection: 'row',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '25%',
                                textAlign: 'center',
                              }}
                            >
                              <Text>Total</Text>
                              <Text>{detail?.report_per_priority_total ?? 0}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.table}>
                          <View style={styles.tableRow}>
                            <Text
                              style={[
                                { ...styles.cell, width: '100%', textAlign: 'center' },
                                styles.tableColHeader,
                              ]}
                            >
                              Request by Category
                            </Text>
                          </View>
                          {grouped.map((pair, groupIndex) => (
                            <View style={styles.tableRow}>
                              {pair?.map((pairItem) => (
                                <View
                                  style={{
                                    ...styles.cell,
                                    flexDirection: 'row',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '50%',
                                    textAlign: 'center',
                                  }}
                                >
                                  <Text>{pairItem?.category_name}</Text>
                                  <Text>{pairItem?.request_count}</Text>
                                </View>
                              ))}
                            </View>
                          ))}
                        </View>

                        <View style={styles.table}>
                          <View style={styles.tableRow}>
                            <Text
                              style={[
                                { ...styles.cell, width: '100%', textAlign: 'center' },
                                styles.tableColHeader,
                              ]}
                            >
                              Request by Division
                            </Text>
                          </View>
                          {groupedDepartment.map((pair, groupIndex) => (
                            <View style={styles.tableRow}>
                              {pair?.map((pairItem) => (
                                <View
                                  style={{
                                    ...styles.cell,
                                    flexDirection: 'row',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '50%',
                                    textAlign: 'center',
                                  }}
                                >
                                  <Text>{pairItem?.department_name}</Text>
                                  <Text>{pairItem?.request_count}</Text>
                                </View>
                              ))}
                            </View>
                          ))}
                        </View>

                        <View style={styles.table}>
                          <View style={styles.tableRow}>
                            <Text
                              style={[
                                { ...styles.cell, width: '100%', textAlign: 'center' },
                                styles.tableColHeader,
                              ]}
                            >
                              Request by Status
                            </Text>
                          </View>
                          {groupedStatus.map((pair, groupIndex) => (
                            <View style={styles.tableRow}>
                              {pair?.map((pairItem) => (
                                <View
                                  style={{
                                    ...styles.cell,
                                    flexDirection: 'row',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '50%',
                                    textAlign: 'center',
                                  }}
                                >
                                  <Text>{pairItem?.progress_status_name}</Text>
                                  <Text>{pairItem?.request_count}</Text>
                                </View>
                              ))}
                            </View>
                          ))}
                        </View>
                      </>
                    );
                  }
                )}
              </>
            )}

            {data?.reportData?.detail?.length > 0 && (
              <>
                <View style={{ width: '100%', fontSize: '12px' }}>
                  <Text style={{ width: '100%' }}>
                    <View style={{ paddingBottom: 2, borderBottom: 1, borderBottomColor: 'grey' }}>
                      <Text style={{ fontSize: '14px', marginTop: '36px' }}>
                        {' '}
                        B. DETAILED REQUEST REPORT
                      </Text>
                    </View>
                  </Text>
                </View>

                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text
                      style={[
                        { ...styles.cell, width: '5%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      No.
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '15%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Date Requested
                    </Text>
                    <View
                      style={[
                        { ...styles.cell, width: '20%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      <Text style={{ textAlign: 'left' }}>Product & Request Title</Text>{' '}
                      <Text style={{ textAlign: 'left', color: '#637381', fontSize: '10px' }}>
                        Request ID
                      </Text>
                    </View>
                    <View
                      style={[
                        { ...styles.cell, width: '15%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      <Text style={{ textAlign: 'left' }}>Client</Text>{' '}
                      <Text style={{ textAlign: 'left', color: '#637381', fontSize: '10px' }}>
                        Division
                      </Text>
                    </View>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Category
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '5%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Total Manpower
                    </Text>
                    <View
                      style={[styles.cell, { width: '10%', padding: 0 }, styles.tableColHeader]}
                    >
                      <Text style={{ textAlign: 'center' }}>Work Duration Hours</Text>
                      <View style={{ flexDirection: 'row', borderTopWidth: 1 }}>
                        <Text style={[styles.cell, { width: '50%' }, styles.tableColHeader]}>
                          Expected
                        </Text>
                        <Text style={[styles.cell, { width: '50%' }, styles.tableColHeader]}>
                          Actual
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Priority
                    </Text>
                    <Text
                      style={[
                        { ...styles.cell, width: '10%', textAlign: 'center' },
                        styles.tableColHeader,
                      ]}
                    >
                      Status
                    </Text>
                  </View>

                  {data?.reportData?.detail?.map((row: any, indexItem: number) => (
                    <View style={styles.tableRow}>
                      <Text style={[{ ...styles.cell, width: '5%', textAlign: 'center' }]}>
                        {indexItem + 1}
                      </Text>
                      <View style={[{ ...styles.cell, width: '15%', textAlign: 'center' }]}>
                        <Text style={{ textAlign: 'left' }}>
                          {dayjs(row?.requested_data).format('DD-MM-YYYY')}
                        </Text>
                        <Text style={{ textAlign: 'left' }}>
                          {dayjs(row?.requested_data).format('hh:mm:ss')}
                        </Text>
                      </View>
                      <Text style={[{ ...styles.cell, width: '20%', textAlign: 'center' }]}>
                        <Text style={{ textAlign: 'left' }}>{row?.product_name}</Text>{' '}
                        <Text style={{ textAlign: 'left', color: '#637381', fontSize: '10px' }}>
                          {row?.request_number}
                        </Text>
                      </Text>
                      <Text style={[{ ...styles.cell, width: '15%', textAlign: 'center' }]}>
                        <Text style={{ textAlign: 'left' }}>{row?.client_company_name}</Text>{' '}
                        <Text style={{ textAlign: 'left', color: '#637381', fontSize: '10px' }}>
                          {row?.client_division}
                        </Text>
                      </Text>
                      <Text style={[{ ...styles.cell, width: '10%', textAlign: 'center' }]}>
                        {row?.category_name}
                      </Text>
                      <Text style={[{ ...styles.cell, width: '5%', textAlign: 'center' }]}>
                        {row?.total_manpower}
                      </Text>
                      <Text style={[{ ...styles.cell, width: '5%', textAlign: 'center' }]}>
                        {row?.estimation_expected}
                      </Text>{' '}
                      <Text style={[{ ...styles.cell, width: '5%', textAlign: 'center' }]}>
                        {row?.estimation_actual}
                      </Text>
                      <Text style={[{ ...styles.cell, width: '10%', textAlign: 'center' }]}>
                        {row?.priority}
                      </Text>
                      <Text style={[{ ...styles.cell, width: '10%', textAlign: 'center' }]}>
                        {row?.status_name}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Footer with page number */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed // ensures it stays in the same place on every page
        />
      </Page>
    </Document>
  );
};

export default ReportRequestPDF;
