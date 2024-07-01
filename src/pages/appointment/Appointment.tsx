import { useState } from "react";
import AppointmentCalendar from "../../components/appointmentCalendar/AppointmentCalendar";
import AppointmentTheme from "../../components/AppointmentTheme/AppointmentTheme";
import { Meeting } from "../../shared/interfaces/meeting";
import { useGetMeetingsQuery } from "../../api/meetingsApi";
import dayjs from "dayjs";
import Skeleton from "../../components/skeleton/Skeleton";
import { getStartOfMonth, getEndOfMonth } from "../../utils/dateUtils";

const Appointment = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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
						onDateChange={setSelectedDate}
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
