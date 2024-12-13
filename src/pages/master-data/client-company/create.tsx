import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CreateClientCompanyView } from 'src/sections/master-data/client-company/view';

// ----------------------------------------------------------------------

export default function ClientCompanyCreatePage() {
  return (
    <>
      <Helmet>
        <title> {`Create Client Company - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <CreateClientCompanyView />
    </>
  );
}
