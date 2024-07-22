import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import WebFontLoader from 'webfontloader';
import AOS from 'aos';
import { GlobalStateProvider } from './context/globalState'
import 'aos/dist/aos.css';

import './styles/index.scss';
import { routes, utilityRoutes } from './steps'
import { App } from 'antd';


WebFontLoader.load({
  google: {
    families: [
      'Open Sans:300,400,500,600,700,800',
      'Maven Pro:300,400,500,600,700,800',
      'Inter:300,400,500,600,700,800',
      'Metropolis:300,400,500,600,700,800,900'
    ],
  },
});

AOS.init();

const router = createBrowserRouter([...routes, ...utilityRoutes]);

const SelvApp: React.FC = () => {

  return (
    <App>
      <React.Suspense fallback={<React.Fragment />}>
        <GlobalStateProvider>
          <RouterProvider router={router} />
        </GlobalStateProvider>
      </React.Suspense>
    </App>
  );
}

export default SelvApp;

