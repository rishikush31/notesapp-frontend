// @flow
import App from 'fusion-react';
import Router from 'fusion-plugin-react-router';
import Styletron from 'fusion-plugin-styletron-react';
import Redux, {ReduxToken, ReducerToken, EnhancerToken} from 'fusion-plugin-react-redux';
import {applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';

import root from './root.js';
import createReduxStore from './store/redux';

import LoggerPlugin from './plugins/logger/plugin';
import {LoggerToken} from './plugins/logger/token';

import ApiMiddleware from './plugins/apiMiddleWare/plugin'
import ApiFetch from './plugins/apiFetch/plugin';
import {ApiFetchToken} from './plugins/apiFetch/token';

export default () => {
  const app = new App(root);
  app.register(LoggerToken, LoggerPlugin);
  app.register(ReduxToken, Redux);
  app.register(ReducerToken, createReduxStore);
  app.register(EnhancerToken, applyMiddleware(thunk));
  app.register(ApiFetchToken, ApiFetch);
  app.register(ApiMiddleware);
  app.register(Styletron);
  app.register(Router);
  return app;
};
