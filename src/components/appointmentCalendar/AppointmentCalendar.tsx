import React, { useState, useCallback } from "react";
import { Calendar as LibCalendar, CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.scss";
import { Meeting } from "../../shared/interfaces/meeting";
import dayjs from "dayjs";

interface CustomCalendarProps {
	onDateChange: (date: Date) => void;
	onMonthChange: (month: Date) => void;
	meetings: Meeting[];
}

interface TileContentProps {
	date: Date;
	view: string;
}

const AppointmentCalendar: React.FC<CustomCalendarProps> = ({
	onDateChange,
	onMonthChange,
	meetings,
}) => {
	const [date, setDate] = useState<Date | null>(new Date());

	const handleDateChange: CalendarProps["onChange"] = useCallback(
		(value: any) => {
			if (value instanceof Date) {
				setDate(value);
				onDateChange(value);
			} else if (
				Array.isArray(value) &&
				value.length > 0 &&
				value[0] instanceof Date
			) {
				setDate(value[0]);
				onDateChange(value[0]);
			}
		},
		[onDateChange]
	);

	const handleActiveStartDateChange: CalendarProps["onActiveStartDateChange"] =
		useCallback(
			({ activeStartDate }: { activeStartDate: Date | null }) => {
				if (activeStartDate) {
					onMonthChange(activeStartDate);
				}
			},
			[onMonthChange]
		);

	const tileContent = useCallback(
		({ date, view }: TileContentProps) => {
			if (view === "month" && Array.isArray(meetings)) {
				const dayMeetings = meetings.filter((meeting) =>
					dayjs(meeting.event_date).isSame(dayjs(date), "day")
				);
				return (
					<div>
						{dayMeetings.map((meeting) => (
							<div key={meeting.id} className="event">
								{meeting.theme.length > 7
									? `${meeting.theme.slice(0, 6)}...`
									: meeting.theme}{" "}
							</div>
						))}
					</div>
				);
			}
			return null;
		},
		[meetings]
	);

	const renderMonthLabel = useCallback(
		(locale: string | undefined, date: Date) => {
			return dayjs(date).format("MMMM");
		},
		[]
	);

	return (
		<div className="calendar-container">
			<LibCalendar
				onChange={handleDateChange}
				value={date}
				prevLabel={<span style={{ color: "#A3A3A3" }}>&lt;</span>}
				nextLabel={<span style={{ color: "#A3A3A3" }}>&gt;</span>}
				prev2Label={null}
				next2Label={null}
				navigationLabel={({ date }) => renderMonthLabel("ru-RU", date)}
				formatMonthYear={renderMonthLabel}
				tileContent={tileContent}
				onActiveStartDateChange={handleActiveStartDateChange}
			/>
		</div>
	);
};

export default AppointmentCalendar;
