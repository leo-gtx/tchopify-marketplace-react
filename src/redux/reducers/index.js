import { combineReducers } from 'redux';
import { persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authedUser from './authedUser';
import app from './app';

const rootPersistConfig = {
    key:'root',
    storage,
  }
export default persistReducer(
    rootPersistConfig,
    combineReducers({
    authedUser,
    app,
    }) 
)
