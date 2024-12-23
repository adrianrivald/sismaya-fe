import 'src/global.css';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/utils/hooks/use-scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return <Router />;
}
