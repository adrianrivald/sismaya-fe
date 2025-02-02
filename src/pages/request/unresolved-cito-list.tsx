import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAuth } from 'src/sections/auth/providers/auth';

import { RequestCitoView } from 'src/sections/request/view';

// ----------------------------------------------------------------------

export default function UnresolvedCitoListPage() {
  const { user } = useAuth();
  const userType = user?.user_info?.user_type;
  return (
    <>
      <Helmet>
        <title> {`Unresolved CITO List - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <RequestCitoView type={userType} step="to_do,in_progress" />
    </>
  );
}
