import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import authReducer from "../features/authSlice";
import { keywordsApi } from "../api/keywordsApi";
import meetingsApi from "../api/meetingsApi";
import protocolsApi from "../api/protocolsApi";
import { statsApi } from "../api/statsApi";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
		[keywordsApi.reducerPath]: keywordsApi.reducer,
		[meetingsApi.reducerPath]: meetingsApi.reducer,
		[protocolsApi.reducerPath]: protocolsApi.reducer,
		[statsApi.reducerPath]: statsApi.reducer,
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			keywordsApi.middleware,
			meetingsApi.middleware,
			protocolsApi.middleware,
			statsApi.middleware
		),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
