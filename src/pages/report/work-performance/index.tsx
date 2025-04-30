import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ReportWorkPerformanceView } from 'src/sections/report/view/work-performance/report-work-performance-view';

// ----------------------------------------------------------------------

export default function ReportWorkPerformancePage() {
  return (
    <>
      <Helmet>
        <title> {`Report Work Performance - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <ReportWorkPerformanceView />
    </>
  );
}
