import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQuery";
import {
	Keyword,
	CreateUpdateKeywordRequest,
	KeywordResponse,
} from "../shared/interfaces/keyword";

export const keywordsApi = createApi({
	reducerPath: "keywordsApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Keyword"],
	endpoints: (builder) => ({
		createKeyword: builder.mutation<
			KeywordResponse,
			CreateUpdateKeywordRequest
		>({
			query: (data) => ({
				url: "/api/keywords",
				method: "POST",
				body: data,
				headers: {
					Accept: "application/json",
				},
			}),
			invalidatesTags: ["Keyword"],
		}),

		fetchKeywords: builder.query<KeywordResponse, void>({
			query: () => ({
				url: "/api/keywords",
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			}),
			providesTags: ["Keyword"],
		}),

		updateKeyword: builder.mutation<KeywordResponse, Keyword>({
			query: ({ id, ...data }) => ({
				url: `/api/keywords/${id}`,
				method: "PUT",
				body: data,
				headers: {
					Accept: "application/json",
				},
			}),
			invalidatesTags: ["Keyword"],
		}),

		deleteKeyword: builder.mutation<KeywordResponse, { id: number }>({
			query: (data) => ({
				url: `/api/keywords/${data.id}`,
				method: "DELETE",
				headers: {
					Accept: "application/json",
				},
			}),
			invalidatesTags: ["Keyword"],
		}),
	}),
});

export const {
	useCreateKeywordMutation,
	useFetchKeywordsQuery,
	useUpdateKeywordMutation,
	useDeleteKeywordMutation,
} = keywordsApi;
