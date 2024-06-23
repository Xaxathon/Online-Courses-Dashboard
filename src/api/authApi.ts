import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { setToken, setRole, logout } from "../features/authSlice";

interface LoginResponse {
	token: string;
	expires_in: number;
}

interface LoginRequest {
	email: string;
	password: string;
}

interface UserResponse {
	user: {
		id: number;
		full_name: string;
		email: string;
		password: string;
		login: string;
		department: string;
		is_active: boolean;
		created_at: string;
		updated_at: string;
		avatar: string;
		role: string;
	};
}

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

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		// попробуем обновить токен
		const refreshResult = await baseQuery("/api/refresh", api, extraOptions);

		if (refreshResult.data) {
			api.dispatch(setToken(refreshResult.data.token));

			// попробуем повторить оригинальный запрос с новым токеном
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout());
		}
	}

	return result;
};

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (credentials) => ({
				url: "/api/login",
				method: "POST",
				body: credentials,
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: "/api/logout",
				method: "POST",
			}),
		}),
		fetchUser: builder.query<UserResponse, void>({
			query: () => ({
				url: "/api/me",
				method: "GET",
			}),
		}),
		updateUser: builder.mutation<
			UserResponse,
			{ id: number; data: FormData | any }
		>({
			query: ({ id, data }) => {
				if (data instanceof FormData) {
					data.append("_method", "PUT");
					return {
						url: `/api/users/${id}`,
						method: "POST",
						body: data,
					};
				}
				return {
					url: `/api/users/${id}`,
					method: "PUT",
					body: data,
				};
			},
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useLazyFetchUserQuery,
	useUpdateUserMutation,
} = authApi;
