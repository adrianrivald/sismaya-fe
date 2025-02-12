import 'src/global.css';

import * as React from 'react';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/utils/hooks/use-scroll-to-top';
import { useSelector } from '@xstate/store/react';
import { permissionStore } from './sections/auth/providers/auth';

const FloatingTimer = React.lazy(() => import('src/sections/task/pip'));

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const permissions = useSelector(permissionStore, (state) => state.context.permissions);
  console.log('list permissions: ', permissions);
  return (
    <>
      <Router />

      <React.Suspense fallback={null}>
        <FloatingTimer />
      </React.Suspense>
    </>
  );
}
