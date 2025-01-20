import 'src/global.css';

import { Router } from 'src/routes/sections';
import { TimerPip } from 'src/sections/task/pip';

import { useScrollToTop } from 'src/utils/hooks/use-scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <>
      <Router />
      <TimerPip />
    </>
  );
}
