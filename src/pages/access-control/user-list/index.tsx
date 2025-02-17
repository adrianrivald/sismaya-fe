import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AccessControlUserListView } from 'src/sections/access-control/user-list/view/user-list-view';

// ----------------------------------------------------------------------

export default function AccessControlUserListPage() {
  return (
    <>
      <Helmet>
        <title> {`Access Control - ${CONFIG.appName}`}</title>
      </Helmet>

      <AccessControlUserListView />
    </>
  );
}
