import 'src/global.css';

import * as React from 'react';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/utils/hooks/use-scroll-to-top';

const FloatingTimer = React.lazy(() => import('src/sections/task/pip'));

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <>
      <Router />

      <React.Suspense fallback={null}>
        <FloatingTimer />
      </React.Suspense>
    </>
  );
}
