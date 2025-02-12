import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EditAccessControlUserView } from 'src/sections/access-control/user-list/view/edit-view';

// ----------------------------------------------------------------------

export default function AccessControlUserListEditPage() {
  return (
    <>
      <Helmet>
        <title> {`Edit User - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <EditAccessControlUserView type="client" />
    </>
  );
}
