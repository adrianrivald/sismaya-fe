import { capitalize } from '@mui/material';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Dayjs, OpUnitType } from 'dayjs';
import dayjs from 'dayjs';

interface ReportProps {
  data: any;
  // hiddenRef: any;
  // vendor: string;
  timePeriod: string;
  reportType: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const ReportWorkPerformanceIndividualPDF = ({
  data,
  // hiddenRef,
  // vendor,
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

  // Helper styles
  const styles = StyleSheet.create({
    page: {
      paddingTop: 100, // leave space for header
      paddingBottom: 40, // leave space for footer
      paddingHorizontal: 20,
      fontSize: 12,
    },
    header: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingBottom: 30,
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
        <View
          style={styles.header}
          render={() => (
            <>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>
                  Employee Performance Report: {capitalize(reportType)} Performance
                </Text>
                <Text style={styles.subtitle}>{renderPeriod(timePeriod)}</Text>
              </View>

              {data?.image && <Image src={data.image} style={styles.logo} />}
            </>
          )}
          fixed // <-- add this
        />

        {data?.reportData?.map((report: any, index: number) => (
          <View key={index} wrap>
            <View style={styles.section}>
              <Text>
                {index + 1}. {report?.employee}
              </Text>

              {/* Monthly Performance Table */}
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View
                    style={{
                      ...styles.cell,
                      width: '100%',
                      backgroundColor: '#DFE3E8',
                      textAlign: 'center',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>
                      {report?.employee}&apos;s Monthly Performance
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.cell, styles.tableColHeader]}>No.</Text>
                  <Text style={[styles.cell, styles.tableColHeader]}>Period</Text>
                  <Text style={[styles.cell, styles.tableColHeader]}>Total Tasks</Text>
                  <Text style={[styles.cell, styles.tableColHeader]}>Total Working Hours</Text>
                </View>
                {report?.performance_report?.map((row: any, i: number) => (
                  <View style={styles.tableRow} key={i}>
                    <Text style={styles.cell}>{i + 1}</Text>
                    <Text style={styles.cell}>{row.period_name}</Text>
                    <Text style={styles.cell}>{row.task_count}</Text>
                    <Text style={styles.cell}>{row.working_hours}</Text>
                  </View>
                ))}
              </View>

              {/* Work Distribution Table */}
              {report?.distribution_report?.length > 0 && (
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={{ ...styles.cell, width: '100%', backgroundColor: '#DFE3E8' }}>
                      <Text style={{ fontWeight: 'bold' }}>
                        {report?.employee}&apos;s Work Distribution
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={[styles.cell, styles.tableColHeader]}>No.</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Product</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Total Tasks</Text>
                    <Text style={[styles.cell, styles.tableColHeader]}>Total Working Hours</Text>
                  </View>
                  {report?.distribution_report?.map((row: any, i: number) => (
                    <View style={styles.tableRow} key={i}>
                      <Text style={styles.cell}>{i + 1}</Text>
                      <Text style={styles.cell}>{row.product_name}</Text>
                      <Text style={styles.cell}>{row.task_count}</Text>
                      <Text style={styles.cell}>{row.working_hours}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Footer with page number */}
        <View
          style={styles.footer}
          render={({ pageNumber, totalPages }: any) => (
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Text>{`Printed on ${dayjs().format('DD/MM/YYYY HH:mm:ss')} WIB`}</Text>
              <Text>{`Page ${pageNumber} of ${totalPages}`}</Text>
            </View>
          )}
          fixed // ensures it stays in the same place on every page
        />
      </Page>
    </Document>
  );
};

export default ReportWorkPerformanceIndividualPDF;
