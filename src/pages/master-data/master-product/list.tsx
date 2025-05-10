import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ListProductView } from 'src/sections/master-data/master-product/view/list-view';
import { ProductFilterView } from 'src/sections/master-data/product-filter/view/product-filter-view';
import { ProductsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function MasterProductPage() {
  return (
    <>
      <Helmet>
        <title> {`Product - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <ListProductView />
    </>
  );
}
