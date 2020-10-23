import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { IntroShowTodos, TestResults, TestDetails } from './pages';
import { routes } from './steps';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to='/demo/app' />
        </Route>
        {
          routes.map(({ path, page }: { path: string; page: any; }) => (
            <Route exact key={path} path={path} component={page} />
          ))
        }
        <Route path={'/health/details/:step/:testId'} component={TestDetails} />
        <Route path={'/health/list/:step'} component={TestResults} />
        <Route render={() => (
           <IntroShowTodos />
        )} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
