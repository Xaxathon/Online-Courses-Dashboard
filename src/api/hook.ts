import {
	useGetMeetingsQuery as useGetMeetingsQueryBase,
	useGetMeetingQuery as useGetMeetingQueryBase,
	useCreateMeetingMutation as useCreateMeetingMutationBase,
	useUpdateMeetingMutation as useUpdateMeetingMutationBase,
	useDeleteMeetingMutation as useDeleteMeetingMutationBase,
} from "./meetingsApi";

export const useGetMeetingsQuery = (
	...args: Parameters<typeof useGetMeetingsQueryBase>
) => {
	const result = useGetMeetingsQueryBase(...args);
	console.log("useGetMeetingsQuery result:", result);
	return result;
};

export const useGetMeetingQuery = (
	...args: Parameters<typeof useGetMeetingQueryBase>
) => {
	const result = useGetMeetingQueryBase(...args);
	console.log("useGetMeetingQuery result:", result);
	return result;
};

export const useCreateMeetingMutation = () => {
	const [createMeeting, result] = useCreateMeetingMutationBase();
	console.log("useCreateMeetingMutation result:", result);
	return [createMeeting, result];
};

export const useUpdateMeetingMutation = () => {
	const [updateMeeting, result] = useUpdateMeetingMutationBase();
	console.log("useUpdateMeetingMutation result:", result);
	return [updateMeeting, result];
};

export const useDeleteMeetingMutation = () => {
	const [deleteMeeting, result] = useDeleteMeetingMutationBase();
	console.log("useDeleteMeetingMutation result:", result);
	return [deleteMeeting, result];
};
