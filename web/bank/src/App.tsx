import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import WebFontLoader from 'webfontloader';
import ReactGA from 'react-ga';
import AOS from 'aos';
import { Landing, IncorporatedCompanies, CompanyDetails } from './pages'
import GlobalState from './context/globalState'
import 'aos/dist/aos.css';
import 'antd/dist/antd.css';
import 'rsuite/lib/styles/index.less';
import 'rsuite/dist/styles/rsuite-default.css'
import './styles/index.scss';
import { routes } from './steps'


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

ReactGA.initialize('UA-159929129-1'); // (trackingID, { debug: true })
ReactGA.set({ anonymizeIp: true });

AOS.init();

const App: React.FC = () => {
  return (
    <GlobalState>
      <BrowserRouter>
        <Switch>
          {
            routes.map(({ path, page }: { path: string; page: any; }) => 
              <Route exact key={path} path={path} component={page} />
            )
          }
          <Route path={'/company/details/:step/:companyId'} component={CompanyDetails} />
          <Route path={'/company/list/:step'} component={IncorporatedCompanies} />
          <Route component={Landing} />
        </Switch>
      </BrowserRouter>
    </GlobalState>
  );
}

export default App;

