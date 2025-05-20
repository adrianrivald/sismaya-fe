import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ListStatusView } from 'src/sections/master-data/master-status/view/list-view';

// ----------------------------------------------------------------------

export default function MasterStatusPage() {
  return (
    <>
      <Helmet>
        <title> {`Status - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <ListStatusView />
    </>
  );
}
