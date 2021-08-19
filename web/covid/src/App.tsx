import React from 'react';
import WebFontLoader from 'webfontloader';
import AOS from 'aos';
import Router from './Router';
import GlobalState from './context/globalState';
import 'aos/dist/aos.css';
import 'antd/dist/antd.css';
import 'rsuite/lib/styles/index.less';
import 'rsuite/dist/styles/rsuite-default.css'
import './styles/index.scss';

WebFontLoader.load({
  google: {
      families: [
        'Open Sans:300,400,500,600,700,800', 
        'Maven Pro:300,400,500,600,700,800',
        'Inter:300,400,500,600,700,800',
        'Metropolis:300,400,500,600,700,800,900',
        'Roboto:300,400,500,600,700,800'
      ],
  },
});

AOS.init();

const App: React.FC = () => (
  <GlobalState>
    <Router />
  </GlobalState>
);

export default App;

