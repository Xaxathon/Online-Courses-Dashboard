import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import AppointmentCalendar from "../../components/appointmentCalendar/AppointmentCalendar";
import AppointmentTheme from "../../components/AppointmentTheme/AppointmentTheme";
import { Meeting } from "../../shared/interfaces/meeting";
import Skeleton from "../../components/skeleton/Skeleton";

import { getStartOfMonth, getEndOfMonth } from "../../utils/dateUtils";

import { useGetMeetingsQuery } from "../../api/meetingsApi";

const Appointment = () => {
	const location = useLocation();
	const [selectedDate, setSelectedDate] = useState<Date>(() => {
		const params = new URLSearchParams(location.search);
		const dateParam = params.get("date");
		return dateParam ? new Date(dateParam) : new Date();
	});
	const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const dateParam = params.get("date");
		if (dateParam) {
			const newDate = new Date(dateParam);
			setSelectedDate(newDate);
			setCurrentMonth(newDate);
		}
	}, [location.search]);

	const start_date_at = getStartOfMonth(currentMonth);
	const end_date_at = getEndOfMonth(currentMonth);

	const { data, error, isLoading, refetch } = useGetMeetingsQuery({
		start_date_at,
		end_date_at,
	});

	const meetings = data?.data || [];

	const handleMonthChange = (month: Date) => {
		setCurrentMonth(month);
	};

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);
	};

	const refetchMeetings = async () => {
		await refetch();
	};

	return (
		<div className="ml-3 grid grid-cols-[800px_minmax(470px,_470px)] gap-3 justify-between items-start mt-5 mr-6 w-full">
			{isLoading ? (
				<div className="ml-3 grid grid-cols-[800px_minmax(470px,_470px)] gap-3 justify-between items-start mt-5 mr-6 w-full h-full pb-[5rem]">
					<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 mt-5 h-full">
						<Skeleton width="20" height="20" className="rounded-lg mb-4" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="1/2" height="4" />
					</div>
					<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 mt-5 h-full">
						<Skeleton width="20" height="20" className="rounded-lg mb-4" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="3/4" height="6" className="mb-2" />
						<Skeleton width="1/2" height="4" className="mb-2" />
						<Skeleton width="1/2" height="4" />
					</div>
				</div>
			) : error ? (
				<div>Error loading meetings</div>
			) : (
				<>
					<AppointmentCalendar
						onDateChange={handleDateChange}
						onMonthChange={handleMonthChange}
						meetings={meetings}
					/>
					<AppointmentTheme
						selectedDate={selectedDate}
						selectedMeeting={selectedMeeting}
						onMeetingSelect={setSelectedMeeting}
						meetings={meetings}
						refetchMeetings={refetchMeetings}
					/>
				</>
			)}
		</div>
	);
};

export default Appointment;
