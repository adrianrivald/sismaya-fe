import { capitalize } from '@mui/material';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Dayjs, OpUnitType } from 'dayjs';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
  timePeriod: string;
  reportType: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const ReportWorkPerformanceDivisionPDF = ({
  data,
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
            <Text style={styles.title}>
              Employee Performance Report: {capitalize(reportType)} Performance
            </Text>
            <Text style={styles.subtitle}>{renderPeriod(timePeriod)}</Text>
          </View>

          {data?.image && <Image src={data.image} style={styles.logo} />}
        </View>
        <View wrap>
          <View style={styles.section}>
            <View style={{ width: '100%' }}>
              <Text style={{ width: '100%' }}>
                {data?.reportData?.individual?.length > 0 && (
                  <View style={{ paddingBottom: 2, borderBottom: 1, borderBottomColor: 'grey' }}>
                    <Text>A. SUMMARY REPORT</Text>
                  </View>
                )}
              </Text>
            </View>
            {data?.reportData?.summary?.map((report: any, index: number) => (
              <>
                <View
                  style={{
                    width: '100%',
                    marginVertical: '12px',
                    paddingVertical: '12px',
                    borderTop: 1,
                    borderTopColor: '#DFE3E8',
                    borderBottom: 1,
                    borderBottomColor: '#DFE3E8',
                  }}
                >
                  <Text style={{ width: '100%' }}>
                    <View style={{ paddingBottom: 2, borderBottom: 1, borderBottomColor: 'grey' }}>
                      <Text>{report?.department}</Text>
                    </View>
                  </Text>
                </View>
                <View>
                  <Text style={{ marginVertical: 1 }}>
                    1. {report?.department} TEAM&apos;S PERFORMANCE
                  </Text>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.cell, styles.tableColHeader]}>No.</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Period</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Total Tasks</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Total Working Hours</Text>
                  </View>
                  {report?.performance_per_year?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={styles.cell}>{i + 1}</Text>
                      <Text style={styles.cell}>{row.period_name}</Text>
                      <Text style={styles.cell}>{row.task_count}</Text>
                      <Text style={styles.cell}>{row.working_hours}</Text>
                    </View>
                  ))}

                  <View style={styles.tableRow}>
                    <Text style={styles.cell} />
                    <Text style={{ ...styles.cell, fontWeight: 'bold' }}>Total</Text>
                    <Text style={{ ...styles.cell, fontWeight: 'bold' }}>
                      {report?.performance_per_year?.length > 1
                        ? report?.performance_per_year?.reduce(
                            (sum: number, item: any) => sum + item.task_count,
                            0
                          )
                        : report?.performance_per_year[0]?.task_count}
                    </Text>
                    <Text style={{ ...styles.cell, fontWeight: 'bold' }}>
                      {report?.performance_per_year?.length > 1
                        ? report?.performance_per_month?.reduce(
                            (sum: number, item: any) => sum + item.working_hours,
                            0
                          )
                        : report?.performance_per_year[0]?.working_hours}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: '18px' }}>
                  <Text style={{ marginVertical: 1 }}>
                    2. {report?.department} TEAM&apos;S PER MONTH
                  </Text>
                </View>

                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.cell, styles.tableColHeader]}>No.</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Period</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Total Tasks</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Total Working Hours</Text>
                  </View>
                  {report?.performance_per_month?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={styles.cell}>{i + 1}</Text>
                      <Text style={styles.cell}>{row.period_name}</Text>
                      <Text style={styles.cell}>{row.task_count}</Text>
                      <Text style={styles.cell}>{row.working_hours}</Text>
                    </View>
                  ))}
                </View>
                {report?.performance_per_product?.length > 0 && (
                  <>
                    <View style={{ marginTop: '18px' }}>
                      <Text style={{ marginVertical: 1 }}>
                        3. {report?.department} TEAM&apos;S PER PRODUCT
                      </Text>
                    </View>

                    <View style={styles.table}>
                      <View style={styles.tableRow}>
                        <Text style={[styles.cell, styles.tableColHeader]}>No.</Text>
                        <Text style={[styles.cell, styles.tableColHeader]}>Product</Text>
                        <Text style={[styles.cell, styles.tableColHeader]}>Total Tasks</Text>
                        <Text style={[styles.cell, styles.tableColHeader]}>
                          Total Working Hours
                        </Text>
                      </View>
                      {report?.performance_per_month?.map((row: any, i: number) => (
                        <View style={styles.tableRow} key={i}>
                          <Text style={styles.cell}>{i + 1}</Text>
                          <Text style={styles.cell}>{row.product_name}</Text>
                          <Text style={styles.cell}>{row.task_count}</Text>
                          <Text style={styles.cell}>{row.working_hours}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </>
            ))}

            {/* Individual Breakdown */}
            {data?.reportData?.individual?.length > 0 && (
              <View
                style={{
                  paddingBottom: 2,
                  marginTop: '18px',
                }}
              >
                <Text>B. INDIVIDUAL BREAKDOWN</Text>
              </View>
            )}
            {data?.reportData?.individual?.map((report: any, index: number) => (
              <>
                <View
                  style={{
                    width: '100%',
                    marginVertical: '12px',
                    paddingVertical: '12px',
                    borderTop: 1,
                    borderTopColor: '#DFE3E8',
                    borderBottom: 1,
                    borderBottomColor: '#DFE3E8',
                  }}
                >
                  <Text style={{ width: '100%' }}>
                    <View style={{ paddingBottom: 2, borderBottom: 1, borderBottomColor: 'grey' }}>
                      <Text>{report?.department}</Text>
                    </View>
                  </Text>
                </View>
                {report?.employees?.map((employee: any, employeeIndex: number) => (
                  <>
                    <View style={{ marginTop: '12px' }}>
                      <Text style={{ marginVertical: 1 }}>
                        {employeeIndex + 1}. {employee?.employee}
                      </Text>
                    </View>

                    <View style={styles.table}>
                      <View style={styles.tableRow}>
                        <Text
                          style={[
                            {
                              width: '100%',
                              border: '1px solid #ccc',
                              padding: 8,
                              textAlign: 'center',
                            },
                            styles.tableColHeader,
                          ]}
                        >
                          {' '}
                          {employee?.employee}&apos;s Monthly Performance
                        </Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={[styles.cell, styles.tableColHeader]}>No.</Text>
                        <Text style={[styles.cell, styles.tableColHeader]}>Period</Text>
                        <Text style={[styles.cell, styles.tableColHeader]}>Total Tasks</Text>
                        <Text style={[styles.cell, styles.tableColHeader]}>
                          Total Working Hours
                        </Text>
                      </View>
                      {employee?.performance_report?.map((row: any, i: number) => (
                        <View style={styles.tableRow} key={i}>
                          <Text style={styles.cell}>{i + 1}</Text>
                          <Text style={styles.cell}>{row.period_name}</Text>
                          <Text style={styles.cell}>{row.task_count}</Text>
                          <Text style={styles.cell}>{row.working_hours}</Text>
                        </View>
                      ))}
                    </View>

                    {employee?.distribution_report?.length > 0 ? (
                      <View style={styles.table}>
                        <View style={styles.tableRow}>
                          <Text style={[styles.cell, styles.tableColHeader]}>No.</Text>
                          <Text style={[styles.cell, styles.tableColHeader]}>Period</Text>
                          <Text style={[styles.cell, styles.tableColHeader]}>Total Tasks</Text>
                          <Text style={[styles.cell, styles.tableColHeader]}>
                            Total Working Hours
                          </Text>
                        </View>
                        {employee?.distribution_report?.map((row: any, i: number) => (
                          <View style={styles.tableRow} key={i}>
                            <Text style={styles.cell}>{i + 1}</Text>
                            <Text style={styles.cell}>{row.period_name}</Text>
                            <Text style={styles.cell}>{row.task_count}</Text>
                            <Text style={styles.cell}>{row.working_hours}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </>
                ))}
              </>
            ))}
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

export default ReportWorkPerformanceDivisionPDF;
