import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import WebFontLoader from 'webfontloader';
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

AOS.init();

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<React.Fragment/>}>
      <GlobalState>
        <BrowserRouter>
          <Switch>
            {
              routes.map(({ path, page }: { path: string; page: any; }) =>
                <Route exact key={path} path={path} component={page} />
              )
            }
            <Route path={'/:lng?/company/details/:step/:companyId'} component={CompanyDetails} />
            <Route path={'/:lng?/company/list/:step'} component={IncorporatedCompanies} />
            <Route component={Landing} />
          </Switch>
        </BrowserRouter>
      </GlobalState>
    </React.Suspense>
  );
}

export default App;

