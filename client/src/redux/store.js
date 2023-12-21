import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userSliceReducer from "./userSlice";
import productSliceReducer from "./productSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import thunk from 'redux-thunk';

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({ 
  user: userSliceReducer,
  product: productSliceReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export const persistor = persistStore(store);