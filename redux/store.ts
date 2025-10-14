import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import { contactApi } from './services/contactApi';
import { serviceRequestApi } from './services/serviceRequestApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [serviceRequestApi.reducerPath]: serviceRequestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, contactApi.middleware, serviceRequestApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);




