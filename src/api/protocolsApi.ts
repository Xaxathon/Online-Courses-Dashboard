import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

import {
	Protocol,
	ProtocolResponse,
	ProtocolsListResponse,
	ProtocolTaskData,
	ProtocolTasksResponse,
	ProtocolMembersResponse,
	CreateProtocolKeywordText,
} from "../shared/interfaces/protocol";

const protocolsApi = createApi({
	reducerPath: "protocolsApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Protocol"],
	endpoints: (builder) => ({
		getProtocols: builder.query<
			ProtocolsListResponse,
			{ limit?: number; page?: number }
		>({
			query: ({ limit, page }) => ({
				url: `/api/protocols`,
				params: { limit, page },
			}),
			transformResponse: (response: { data: ProtocolsListResponse }) => {
				console.log("Full response:", response);
				if (!Array.isArray(response.data.data)) {
					throw new Error("Response data is not an array");
				}
				return response.data;
			},
			providesTags: (result) =>
				result
					? [
							...result.data.map(({ id }) => ({
								type: "Protocol" as const,
								id,
							})),
							{ type: "Protocol" as const, id: "LIST" },
					  ]
					: [{ type: "Protocol" as const, id: "LIST" }],
		}),

		getProtocol: builder.query<ProtocolResponse, number>({
			query: (id) => `/api/protocols/${id}`,
		}),

		createProtocol: builder.mutation<{ protocol: Protocol }, FormData>({
			query: (formData) => ({
				url: "/api/protocols",
				method: "POST",
				body: formData,
			}),
			invalidatesTags: [{ type: "Protocol", id: "LIST" }],
		}),

		updateProtocol: builder.mutation<
			Protocol,
			{ id: number; data: Partial<Protocol> }
		>({
			query: ({ id, data }) => ({
				url: `/api/protocols/${id}`,
				method: "PUT",
				body: data,
			}),
		}),

		deleteProtocol: builder.mutation<void, number>({
			query: (id) => ({
				url: `/api/protocols/${id}`,
				method: "DELETE",
			}),
		}),

		createProtocolTask: builder.mutation<
			ProtocolTaskData,
			{ protocolId: number; data: ProtocolTaskData }
		>({
			query: ({ protocolId, data }) => ({
				url: `/api/protocols/${protocolId}/tasks`,
				method: "POST",
				body: data,
			}),
		}),

		getProtocolTasks: builder.query<
			ProtocolTasksResponse,
			{ limit?: number; page?: number; search?: string }
		>({
			query: ({ limit, page, search }) => ({
				url: `/api/protocols/tasks`,
				params: { limit, page, search },
			}),
			transformResponse: (response: ProtocolTasksResponse) => response,
		}),
		updateProtocolTask: builder.mutation<
			ProtocolTaskData,
			{ taskId: number; status: string }
		>({
			query: ({ taskId, status }) => ({
				url: `/api/protocols/tasks/${taskId}`,
				method: "PUT",
				body: { status },
			}),
		}),
		deleteProtocolTask: builder.mutation<void, { taskId: number }>({
			query: ({ taskId }) => ({
				url: `/api/protocols/tasks/${taskId}`,
				method: "DELETE",
			}),
		}),

		getProtocolMembers: builder.query<ProtocolMembersResponse, number>({
			query: (protocolId) => ({
				url: `/api/protocols/${protocolId}/members`,
				method: "GET",
			}),
			transformResponse: (response: { data: ProtocolMembersResponse }) =>
				response.data,
		}),

		addProtocolMember: builder.mutation<
			void,
			{ protocolId: number; memberId: number }
		>({
			query: ({ protocolId, memberId }) => ({
				url: `/api/protocols/${protocolId}/members`,
				method: "POST",
				body: { member_id: memberId },
			}),
		}),

		deleteProtocolMember: builder.mutation<void, { memberId: number }>({
			query: ({ memberId }) => ({
				url: `/api/protocols/members/${memberId}`,
				method: "DELETE",
			}),
		}),

		saveFinalProtocol: builder.mutation<
			void,
			{ id: number; data: CreateProtocolKeywordText }
		>({
			query: ({ id, data }) => ({
				url: `/api/protocols/${id}/final`,
				method: "POST",
				body: data,
			}),
		}),

		generatePDF: builder.mutation<string, number>({
			query: (id) => ({
				url: `/api/protocols/${id}/documents/pdf`,
				method: "GET",
				responseHandler: async (response) => {
					const blob = await response.blob();
					return URL.createObjectURL(blob);
				},
			}),
		}),

		generateDOCX: builder.mutation<string, number>({
			query: (id) => ({
				url: `/api/protocols/${id}/documents/docx`,
				method: "GET",
				responseHandler: async (response) => {
					const blob = await response.blob();
					return URL.createObjectURL(blob);
				},
			}),
		}),
		processVideo: builder.mutation<void, number>({
			query: (id) => ({
				url: `/api/protocols/${id}/process-video`,
				method: "POST",
			}),
		}),
	}),
});

export const {
	useGetProtocolsQuery,
	useGetProtocolQuery,
	useCreateProtocolMutation,
	useUpdateProtocolMutation,
	useDeleteProtocolMutation,
	useCreateProtocolTaskMutation,
	useGetProtocolTasksQuery,
	useUpdateProtocolTaskMutation,
	useDeleteProtocolTaskMutation,
	useGetProtocolMembersQuery,
	useAddProtocolMemberMutation,
	useDeleteProtocolMemberMutation,
	useSaveFinalProtocolMutation,
	useGeneratePDFMutation,
	useGenerateDOCXMutation,
	useProcessVideoMutation,
} = protocolsApi;

export default protocolsApi;
