import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import WebFontLoader from 'webfontloader';
import AOS from 'aos';
import GlobalState from './context/globalState'
import 'aos/dist/aos.css';
import 'rsuite/lib/styles/index.less';
import 'rsuite/dist/styles/rsuite-default.css'
import './styles/index.scss';
import { routes } from './steps'
import { WebsocketProvider } from './context/websocket';


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

const router = createBrowserRouter(routes);

const App: React.FC = () => {

  return (
    <React.Suspense fallback={<React.Fragment />}>
      <GlobalState>
        <WebsocketProvider>
          <RouterProvider router={router} />
        </WebsocketProvider>
      </GlobalState>
    </React.Suspense>
  );
}

export default App;

