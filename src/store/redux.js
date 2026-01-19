import {combineReducers} from 'redux';

import authReducer from './auth/reducer';
import notesReducer from './notes/reducer';

export default combineReducers({
  auth: authReducer,
  notes: notesReducer,
});
