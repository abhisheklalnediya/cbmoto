import { createStore, applyMiddleware } from 'redux';

import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from '../app/reducers/index'; //Import the reducer

export default createStore(reducers, applyMiddleware(promise(), thunk, logger));
