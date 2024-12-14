import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CreateRequestView } from 'src/sections/request/view/create-view';

// ----------------------------------------------------------------------

export default function RequestCreatePage() {
  return (
    <>
      <Helmet>
        <title> {`Create Request - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <CreateRequestView />
    </>
  );
}
