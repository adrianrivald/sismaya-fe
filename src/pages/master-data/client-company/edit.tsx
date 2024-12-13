import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EditClientCompanyView } from 'src/sections/master-data/client-company/view';

// ----------------------------------------------------------------------

export default function InternalCompanyEditPage() {
  return (
    <>
      <Helmet>
        <title> {`Edit Internal Company - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <EditClientCompanyView />
    </>
  );
}
