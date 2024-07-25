import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MeetingCalendar from "@components/meetingCalendar/MeetingCalendar";
import MeetingTheme from "@components/meetingTheme/MeetingTheme";
import Skeleton from "@components/skeleton/Skeleton";

import { getStartOfMonth, getEndOfMonth } from "@/utils/dateUtils";

import { useGetMeetingsQuery } from "@/api/meetingsApi";

import { Meeting } from "@/shared/interfaces/meeting";

const Meetings = () => {
	const location = useLocation();

	const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date>(() => {
		const params = new URLSearchParams(location.search);
		const dateParam = params.get("date");
		return dateParam ? new Date(dateParam) : new Date();
	});

	const { data, error, isLoading, refetch } = useGetMeetingsQuery({
		start_date_at: getStartOfMonth(currentMonth),
		end_date_at: getEndOfMonth(currentMonth),
	});

	const meetings = data?.data || [];

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const dateParam = params.get("date");
		if (dateParam) {
			const newDate = new Date(dateParam);
			setSelectedDate(newDate);
			setCurrentMonth(newDate);
		}
	}, [location.search]);

	const handleMonthChange = (month: Date) => {
		setCurrentMonth(month);
	};

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);
	};

	const refetchMeetings = async () => {
		await refetch();
	};

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	return (
		<div className="ml-3 grid grid-cols-[minmax(29.4rem,_1fr),_minmax(23.1rem,_0.5fr)] gap-3 justify-between items-start mt-5 mr-6 w-full">
			<MeetingCalendar
				onDateChange={handleDateChange}
				onMonthChange={handleMonthChange}
				meetings={meetings}
			/>
			<MeetingTheme
				selectedDate={selectedDate}
				selectedMeeting={selectedMeeting}
				onMeetingSelect={setSelectedMeeting}
				meetings={meetings}
				refetchMeetings={refetchMeetings}
				error={error}
			/>
		</div>
	);
};

const LoadingSkeleton = () => (
	<div className="ml-3 grid grid-cols-[minmax(29.4rem,_1fr),_minmax(23.1rem,_0.5fr)] gap-3 justify-between items-start mt-5 mr-6 w-full h-screen pb-[5rem]">
		<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 mt-5 h-full">
			<Skeleton width="full" height="full" className="rounded-lg mb-4" />
		</div>
		<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 mt-5 h-full">
			<Skeleton width="full" height="full" className="rounded-lg mb-4" />
		</div>
	</div>
);

export default Meetings;
