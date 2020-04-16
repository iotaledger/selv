import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import cookies from 'js-cookie';
import { Login, IntroShowTodos, TestResults, TestDetails } from './pages';
import Context from './context/app-context';
import { routes } from './steps';
import { passwordHash } from './config.json';

const Router: React.FC = () => {
  const { requestPassword, setRequestPassword }: any = useContext(Context);

  useEffect(() => {
      const ack = cookies.get('password');

      if ((!ack || ack !== passwordHash)) {
        setRequestPassword(true);
      }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to='/demo/app' />
        </Route>
        <Route path={'/demo/login'} component={Login} />
        {
          routes.map(({ path, page }: { path: string; page: any; }) => (
            requestPassword 
              ? <Route key={path} path={path} component={Login} />
              : <Route exact key={path} path={path} component={page} />
          ))
        }
        <Route path={'/health/details/:step/:testId'} component={TestDetails} />
        <Route path={'/health/list/:step'} component={TestResults} />
        <Route render={() => (
          requestPassword ? <Redirect to='/demo/login' /> : <IntroShowTodos />
        )} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;

