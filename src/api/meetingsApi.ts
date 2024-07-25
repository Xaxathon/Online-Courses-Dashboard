import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery"; // Импортируем baseQueryWithReauth
import {
	Meeting,
	CreateMeeting,
	UpdateMeeting,
	MeetingResponse,
} from "../shared/interfaces/meeting";

const meetingsApi = createApi({
	reducerPath: "meetingsApi",
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getMeetings: builder.query<
			MeetingResponse,
			{ start_date_at: string; end_date_at: string }
		>({
			query: ({ start_date_at, end_date_at }) => ({
				url: `/api/meetings`,
				params: { start_date_at, end_date_at },
			}),
		}),

		createMeeting: builder.mutation<
			{ meeting: Meeting },
			{ data: FormData | Partial<CreateMeeting> }
		>({
			query: ({ data }) => {
				if (data instanceof FormData) {
					return {
						url: "/api/meetings",
						method: "POST",
						body: data,
					};
				}
				return {
					url: "/api/meetings",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				};
			},
		}),

		updateMeeting: builder.mutation<
			{ meeting: Meeting },
			{ id: number; data: FormData | Partial<UpdateMeeting> }
		>({
			query: ({ id, data }) => {
				if (data instanceof FormData) {
					data.append("_method", "PUT");
					return {
						url: `/api/meetings/${id}`,
						method: "POST",
						body: data,
					};
				}
				return {
					url: `/api/meetings/${id}`,
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				};
			},
		}),

		deleteMeeting: builder.mutation<void, number>({
			query: (id) => ({
				url: `/api/meetings/${id}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useGetMeetingsQuery,
	useCreateMeetingMutation,
	useUpdateMeetingMutation,
	useDeleteMeetingMutation,
} = meetingsApi;

export default meetingsApi;
