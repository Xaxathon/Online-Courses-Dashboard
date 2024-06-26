import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { setToken, logout } from "../features/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://85.193.90.243",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		headers.set("Accept", "application/json");
		return headers;
	},
});

interface RefreshResponse {
	token: string;
}

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
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

function isRefreshResponse(data: any): data is RefreshResponse {
	return data && typeof data === "object" && "token" in data;
}

export { baseQuery, baseQueryWithReauth };
