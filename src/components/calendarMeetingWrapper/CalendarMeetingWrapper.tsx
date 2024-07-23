import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import Calendar from "../calendar/Calendar";

interface CalendarWrapperProps {
	onChange: (date: Date) => void;
	onMonthChange: (date: Date) => void;
	value: Date | null;
	meetingDates: Date[];
}

const CalendarWrapper = (props: CalendarWrapperProps) => {
	const navigate = useNavigate();

	const handleDateClick = (date: Date) => {
		const formattedDate = dayjs(date).format("YYYY-MM-DD");
		navigate(`/main/meetings?date=${formattedDate}`);
	};

	return (
		<Calendar {...props} onDateClick={handleDateClick} showMeetingDots={true} />
	);
};

export default CalendarWrapper;
