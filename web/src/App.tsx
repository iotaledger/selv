import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Landing, CompanyDetails } from './pages'
import GlobalState from './context/globalState'
import 'rsuite/lib/styles/index.less';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { routes } from './steps'

toast.configure();

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

