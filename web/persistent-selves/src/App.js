import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import WebFontLoader from 'webfontloader';
import ReactGA from 'react-ga';
import { IntroWelcome } from './pages'
import GlobalState from './context/globalState'
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
        'Metropolis:300,400,500,600,700,800,900',
        'Roboto:300,400,500,600,700,800,900'
      ],
  },
});

ReactGA.initialize('UA-159929129-1'); // (trackingID, { debug: true })
ReactGA.set({ anonymizeIp: true });

const App = () => {
  return (
    <GlobalState>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to='/demo/welcome' />
          </Route>
          {
            routes.map(({ path, page }) => 
              <Route exact key={path} path={path} component={page} />
            )
          }
          <Route render={() => (
           <IntroWelcome />
          )} />
        </Switch>
      </BrowserRouter>
    </GlobalState>
  );
}

export default App;

