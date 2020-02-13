import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import WebFontLoader from 'webfontloader';
import ReactGA from 'react-ga';
import { Landing, IncorporatedCompanies, CompanyDetails } from './pages'
import GlobalState from './context/globalState'
import 'antd/dist/antd.css';
import 'rsuite/lib/styles/index.less';
import 'rsuite/dist/styles/rsuite-default.css'
import './styles/index.scss';
import { routes } from './steps'

WebFontLoader.load({
  google: {
      families: ['Open Sans:300,400,600,700', 'Maven Pro:300,400,600,700'],
  },
});

ReactGA.initialize('222308434'); // (trackingID, { debug: true })
ReactGA.set({ anonymizeIp: true });

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
          <Route path={'/progress/company/details/:step/:companyId'} component={CompanyDetails} />
          <Route path={'/progress/company/list/:step'} component={IncorporatedCompanies} />
          <Route component={Landing} />
        </Switch>
      </BrowserRouter>
    </GlobalState>
  );
}

export default App;

