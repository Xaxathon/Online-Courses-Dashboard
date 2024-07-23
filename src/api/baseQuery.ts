import { fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { RootState } from "../store/store";
import { setToken, logout } from "../store/slices/authSlice";

interface RefreshResponse {
	token: string;
}

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		headers.set("Accept", "application/json");
		return headers;
	},
});

const baseQueryWithReauth = async (
	args: string | FetchArgs,
	api: BaseQueryApi,
	extraOptions: {}
) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refreshResult = await baseQuery("/api/refresh", api, extraOptions);
		if (refreshResult.data && isRefreshResponse(refreshResult.data)) {
			api.dispatch(setToken(refreshResult.data.token));
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout());
		}
	}

	return result;
};

function isRefreshResponse(data: unknown): data is RefreshResponse {
	return data !== null && typeof data === "object" && "token" in data;
}

export { baseQuery, baseQueryWithReauth };
