import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Landing, CompanyDetails } from './pages'
import GlobalState from './context/globalState'
import 'rsuite/lib/styles/index.less';
import './App.css';
import { routes } from './steps'

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
          <Route exact path={'/details/company/:companyId'} component={CompanyDetails} />
          <Route component={Landing} />
        </Switch>
      </BrowserRouter>
    </GlobalState>
  );
}

export default App;

