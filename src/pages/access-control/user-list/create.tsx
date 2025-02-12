import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CreateAccessControlUserView } from 'src/sections/access-control/user-list/view/create-view';

// ----------------------------------------------------------------------

export default function AccessControlUserListCreatePage() {
  return (
    <>
      <Helmet>
        <title> {`Create User - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <CreateAccessControlUserView />
    </>
  );
}
