import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFound from '@/components/NotFound';
import LoadingPage from '@/components/LoadingPage';

import Layouts from '@/layouts';
import Welcome from '@/pages/Welcome';



/* const Layouts = lazy(() => import('@/layouts'));
const DeptDataStatistics = lazy(() => import('@/pages/DeptDataStatistics'));
const SupplierDataStatistics = lazy(() => import('@/pages/SupplierDataStatistics'));
const DataMaintenance = lazy(() => import('@/pages/DataMaintenance'));
const Roster = lazy(() => import('@/pages/Roster')); */

const Routers = (): React.ReactElement => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Layouts />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Routers;
