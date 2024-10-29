import rootReducer from './modules';
import { composeWithDevTools } from '@redux-devtools/extension';
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { createStore } from 'redux';
import { applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import logger from 'redux-logger';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'review']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunk, logger))
);


export default store;