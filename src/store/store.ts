import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import authReducer from "../features/authSlice";
import { keywordsApi } from "../api/keywordsApi";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
		[keywordsApi.reducerPath]: keywordsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware, keywordsApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
