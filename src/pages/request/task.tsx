import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { RequestTaskView } from 'src/sections/request/task/view';

// ----------------------------------------------------------------------

export default function RequestTaskPage() {
  const params = useParams<{ id: string }>();

  return (
    <>
      <Helmet>
        <title>Task - {CONFIG.appName}</title>
      </Helmet>

      <RequestTaskView requestId={Number(params.id)} />
    </>
  );
}
