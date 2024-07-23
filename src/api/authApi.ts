import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQuery";
import { LoginResponse, LoginRequest } from "../shared/interfaces/auth";
import {
	UserResponse,
	CreateUserRequest,
	FetchUsersResponse,
	FetchUsersParams,
} from "../shared/interfaces/user";
import { logout } from "../store/slices/authSlice";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["User"],
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
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(logout());
				} catch {
					console.error("Failed to logout");
				}
			},
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
		resetPassword: builder.mutation({
			query: (data) => ({
				url: "/api/change-password/reset",
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
				},
			}),
		}),
		fetchPersonalUser: builder.query<UserResponse, void>({
			query: () => ({
				url: "/api/me",
				method: "GET",
			}),
		}),
		fetchUserById: builder.query<FetchUsersResponse, number>({
			query: (id) => ({
				url: `/api/users/${id}`,
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
			invalidatesTags: ["User"],
		}),
		createUser: builder.mutation<{ user: UserResponse }, CreateUserRequest>({
			query: (data) => ({
				url: "/api/users",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["User"],
		}),
		fetchUsers: builder.query<FetchUsersResponse, FetchUsersParams>({
			query: (params) => ({
				url: "/api/users",
				method: "GET",
				params: {
					limit: params?.limit,
					page: params?.page,
					search: params?.search,
					with_blocked: params?.with_blocked ? "1" : undefined,
				},
			}),
			providesTags: ["User"],
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useLazyFetchPersonalUserQuery,
	useFetchUserByIdQuery,
	useUpdateUserMutation,
	useCreateUserMutation,
	useFetchUsersQuery,
} = authApi;
