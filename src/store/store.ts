import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import authReducer from "../features/authSlice";
import { keywordsApi } from "../api/keywordsApi";
import meetingsApi from "../api/meetingsApi";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
		[keywordsApi.reducerPath]: keywordsApi.reducer,
		[meetingsApi.reducerPath]: meetingsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			keywordsApi.middleware,
			meetingsApi.middleware
		),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
