import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Landing } from './pages'
import GlobalState from './context/globalState'
import 'rsuite/lib/styles/index.less'; // or 'rsuite/dist/styles/rsuite-default.css'
import './App.css';
import { routes } from './steps'

// context for translations
// context for steps
// custom hook to determine current step/subspep and link to next step

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
          <Route component={Landing} />
        </Switch>
      </BrowserRouter>
    </GlobalState>
  );
}

export default App;

