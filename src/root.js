// @flow
import React from 'react';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {Route, Switch} from 'fusion-plugin-react-router';
import {ToastProvider} from './ui/toast/ToastContext';
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
  <ToastProvider>
   <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/" component={Home} />
  </Switch>
  </ToastProvider>
);

export default root;
