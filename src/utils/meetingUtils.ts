import dayjs from "dayjs";
import { Meeting } from "../shared/interfaces/meeting";

export const filterMeetingsByDate = (
	meetings: Meeting[],
	date: Date | null
): Meeting[] => {
	if (!date) return [];
	return meetings.filter((meeting) =>
		dayjs(meeting.event_date).isSame(dayjs(date), "day")
	);
};

export const sortMeetingsByStartTime = (meetings: Meeting[]): Meeting[] => {
	return meetings.sort((a, b) =>
		dayjs(a.event_start_time, "HH:mm").diff(dayjs(b.event_start_time, "HH:mm"))
	);
};
