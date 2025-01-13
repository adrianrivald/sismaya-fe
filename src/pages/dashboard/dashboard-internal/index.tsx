import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardInternalView } from 'src/sections/overview/view/internal-dashboard/dashboard-internal-general-view';

// ----------------------------------------------------------------------

export default function DashboardInternalPage() {
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <DashboardInternalView />
    </>
  );
}
