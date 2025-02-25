import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AutoResponseView } from 'src/sections/auto-response/view/auto-response-view';

// ----------------------------------------------------------------------

export default function AutoResponsePage() {
  return (
    <>
      <Helmet>
        <title> {`Auto Reponse - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <AutoResponseView />
    </>
  );
}
