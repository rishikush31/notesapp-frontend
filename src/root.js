// @flow
import React from 'react';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {Route, Switch} from 'fusion-plugin-react-router';
import {split} from 'fusion-react';

const Login = split({
  load: () => import('./pages/login'),
  LoadingComponent: () => <div>Loading Login…</div>,
  ErrorComponent: () => <div>Error loading Login</div>,
});

const Register = split({
  load: () => import('./pages/register'),
  LoadingComponent: () => <div>Loading Register…</div>,
  ErrorComponent: () => <div>Error loading Register</div>,
});

const Home = split({
  load: () => import('./pages/home'),
  LoadingComponent: () => <div>Loading Home…</div>,
  ErrorComponent: () => <div>Error loading Home</div>,
});

const root = (
   <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/" component={Home} />
  </Switch>
);

export default root;
