import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MonitorPersonalLoadView } from 'src/sections/monitor-personal-load/view/monitor-personal-load-view';

// ----------------------------------------------------------------------

export default function MonitorPersonalLoadPage() {
  return (
    <>
      <Helmet>
        <title> {`Monitor Personal Load - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <MonitorPersonalLoadView />
    </>
  );
}
