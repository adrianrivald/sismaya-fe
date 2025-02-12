import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EditAccessControlUserGroupView } from 'src/sections/access-control/user-group/view/edit-view';

// ----------------------------------------------------------------------

export default function AccessControlUserGroupEditPage() {
  return (
    <>
      <Helmet>
        <title> {`Edit User Group - ${CONFIG.appName}`}</title>
      </Helmet>

      <EditAccessControlUserGroupView />
    </>
  );
}
