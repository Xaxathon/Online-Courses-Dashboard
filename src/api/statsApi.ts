import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

import {
	EntityStatsData,
	EntityStatsResponse,
	KpiTasksStatsData,
	KpiTasksStatsResponse,
	ManagerStatsData,
	MeetingStatsData,
	MeetingStatsResponse,
} from "../shared/interfaces/stats";

export const statsApi = createApi({
	reducerPath: "statsApi",
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		fetchManagerStats: builder.query<{ data: ManagerStatsData }, void>({
			query: () => ({
				url: "/api/stats/manager/all",
				method: "GET",
			}),
		}),

		fetchMeetingStats: builder.query<
			MeetingStatsData[],
			{ start_date_at: string; end_date_at: string }
		>({
			query: ({ start_date_at, end_date_at }) => ({
				url: "/api/stats/secretary/meetings",
				method: "GET",
				params: { start_date_at, end_date_at },
			}),
			transformResponse: (response: MeetingStatsResponse) => response.data,
		}),

		fetchEntityStats: builder.query<EntityStatsData, number>({
			query: (secretaryId) => ({
				url: `/api/stats/secretary/${secretaryId}/entities`,
				method: "GET",
			}),
			transformResponse: (response: EntityStatsResponse) => response.data,
		}),

		fetchKpiTasksStats: builder.query<
			KpiTasksStatsData,
			{ secretaryId: number; date: string }
		>({
			query: ({ secretaryId, date }) => ({
				url: `/api/stats/secretary/${secretaryId}/tasks`,
				method: "GET",
				params: { date },
			}),
			transformResponse: (response: KpiTasksStatsResponse) => response.data,
		}),
	}),
});

export const {
	useFetchManagerStatsQuery,
	useFetchMeetingStatsQuery,
	useFetchEntityStatsQuery,
	useFetchKpiTasksStatsQuery,
} = statsApi;
