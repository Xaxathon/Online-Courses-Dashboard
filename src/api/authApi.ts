import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQuery";
import { LoginResponse, LoginRequest } from "../shared/interfaces/auth";
import {
	UserResponse,
	User,
	CreateUserRequest,
} from "../shared/interfaces/user";

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
		forgotPassword: builder.mutation<void, { email: string }>({
			query: (data) => ({
				url: "/api/change-password/send-link",
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		fetchUser: builder.query<UserResponse, void>({
			query: () => ({
				url: "/api/me",
				method: "GET",
			}),
		}),
		updateUser: builder.mutation<
			{ user: UserResponse },
			{ id: number; data: FormData | Partial<Omit<UserResponse, "password">> }
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
		createUser: builder.mutation<{ user: UserResponse }, CreateUserRequest>({
			query: (data) => ({
				url: "/api/users",
				method: "POST",
				body: data,
			}),
		}),
		fetchUsers: builder.query<{ data: { data: User[] } }, void>({
			query: () => ({
				url: "/api/users",
				method: "GET",
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useForgotPasswordMutation,
	useLazyFetchUserQuery,
	useUpdateUserMutation,
	useCreateUserMutation,
	useFetchUsersQuery,
} = authApi;
