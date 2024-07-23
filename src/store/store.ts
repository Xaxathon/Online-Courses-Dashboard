import { configureStore, combineReducers } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";
import { authApi } from "../api/authApi";
import authReducer from "./slices/authSlice";
import { keywordsApi } from "../api/keywordsApi";
import meetingsApi from "../api/meetingsApi";
import protocolsApi from "../api/protocolsApi";
import { statsApi } from "../api/statsApi";

const rootReducer = combineReducers({
	auth: authReducer,
	notification: notificationReducer,
	[authApi.reducerPath]: authApi.reducer,
	[keywordsApi.reducerPath]: keywordsApi.reducer,
	[meetingsApi.reducerPath]: meetingsApi.reducer,
	[protocolsApi.reducerPath]: protocolsApi.reducer,
	[statsApi.reducerPath]: statsApi.reducer,
});

const reducer = (state, action) => {
	if (action.type === "auth/logout") {
		state = undefined;
	}
	return rootReducer(state, action);
};

export const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					`${protocolsApi.reducerPath}/executeMutation/fulfilled`,
					`${protocolsApi.reducerPath}/executeMutation/rejected`,
				],
				ignoredPaths: [`${protocolsApi.reducerPath}.mutations`],
			},
		}).concat(
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
