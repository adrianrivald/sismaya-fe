import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AccessControlUserGroupView } from 'src/sections/access-control/user-group/view/user-group-view';

// ----------------------------------------------------------------------

export default function AccessControlUserGroupPage() {
  return (
    <>
      <Helmet>
        <title> {`Access Control - ${CONFIG.appName}`}</title>
      </Helmet>

      <AccessControlUserGroupView />
    </>
  );
}
