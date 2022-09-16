import {createStore, compose} from 'redux';
import {persistStore} from 'redux-persist';

import middlewares from './middlewares';
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, /* preloadedState, */ composeEnhancers(
    middlewares
    ));
const persistor = persistStore(store)

export { store, persistor }