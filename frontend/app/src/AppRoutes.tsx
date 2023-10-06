import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { RoutePaths } from 'types';

const Home = React.lazy(() => import('pages/Home/Home'));

const AppRoutes = (): JSX.Element => (
  <Suspense fallback={<></>}>
    <BrowserRouter>
      <Routes>
        <Route path={RoutePaths.HOME_PAGE} element={<Home />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default AppRoutes;
