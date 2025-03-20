import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EditClientSubCompanyView } from 'src/sections/master-data/client-company/view/subsidiary-edit-view';

// ----------------------------------------------------------------------

export default function ClientSubCompanyEditPage() {
  return (
    <>
      <Helmet>
        <title> {`Edit Client Sub-Company - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <EditClientSubCompanyView />
    </>
  );
}
