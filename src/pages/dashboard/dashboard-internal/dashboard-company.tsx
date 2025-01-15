import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { useAuth } from 'src/sections/auth/providers/auth';

import { DashboardClientView, DashboardInternalCompanyView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function DashboardInternalCompanyPage() {
  const { user } = useAuth();
  const { vendor } = useParams();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  return (
    <>
      <Helmet>
        <title> {`Dashboard ${vendor} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <DashboardInternalCompanyView idCompany={idCurrentCompany} vendor={vendor ?? ''} />
    </>
  );
}
