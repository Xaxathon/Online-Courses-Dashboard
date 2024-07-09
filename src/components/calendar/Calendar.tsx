import { useState, useEffect, useCallback } from "react";

import { Calendar as DateCalendar, CalendarProps } from "react-calendar";

import styled from "styled-components";
import "react-calendar/dist/Calendar.css";

import dayjs from "dayjs";

type Value = Date | null;

interface CustomCalendarProps {
	onChange: (date: Date) => void;
	onMonthChange?: (date: Date) => void;
	onDateClick?: (date: Date) => void;
	value: Value;
	meetingDates?: Date[];
	showMeetingDots?: boolean;
}

const Calendar: React.FC<CustomCalendarProps> = ({
	onChange,
	onMonthChange,
	onDateClick,
	value,
	meetingDates = [],
	showMeetingDots = false,
}) => {
	const [date, setDate] = useState<Value>(value);

	const handleDateChange: CalendarProps["onChange"] = (value) => {
		if (value instanceof Date) {
			setDate(value);
			onChange(value);
			if (onDateClick) {
				onDateClick(value);
			}
		}
	};

	useEffect(() => {
		if (value !== date) {
			setDate(value);
		}
	}, [value]);

	const handleActiveStartDateChange: CalendarProps["onActiveStartDateChange"] =
		useCallback(
			({ activeStartDate }: { activeStartDate: Date | null }) => {
				if (activeStartDate && onMonthChange) {
					onMonthChange(activeStartDate);
				}
			},
			[onMonthChange]
		);

	const tileContent: CalendarProps["tileContent"] = useCallback(
		({ date, view }: { date: Date; view: string }) => {
			if (view === "month" && showMeetingDots) {
				const hasMeeting = meetingDates.some((meetingDate) =>
					dayjs(meetingDate).isSame(dayjs(date), "day")
				);
				return hasMeeting ? <MeetingDot /> : null;
			}
			return null;
		},
		[meetingDates, showMeetingDots]
	);

	return (
		<CalendarContainer>
			<StyledCalendar
				onChange={handleDateChange}
				value={date}
				tileContent={tileContent}
				onActiveStartDateChange={handleActiveStartDateChange}
			/>
		</CalendarContainer>
	);
};

export default Calendar;

const CalendarContainer = styled.div`
	border-radius: 1rem;
	padding: 0.2rem 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(
		180deg,
		rgba(234, 207, 255, 0.63) 0.55%,
		rgba(231, 249, 255, 0.54) 100%
	);
`;

const StyledCalendar = styled(DateCalendar)`
	background: none;
	width: 100%;
	height: 100%;
	border: none;
	background-color: transparent;
	font-family: "Poppins", sans-serif;

	& .react-calendar__navigation {
		display: flex;
		padding: 0 1rem;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		font-weight: 600;
		color: #7130a3;
		background: none;
		border: none;
		position: relative;

		& .react-calendar__navigation__label {
			color: #7130a3;
			display: inline;
			text-transform: capitalize;
		}

		& button {
			color: #a3a3a3;
		}
	}

	& .react-calendar__month-view__weekdays {
		text-align: center;
		font-size: 1rem;
		font-weight: 400;
		color: #779f7c;

		text-decoration: 1px solid #779f7c;
		margin-bottom: 0.1rem;

		& .react-calendar__month-view__weekdays__weekday {
			padding: 0.6rem 0;

			abbr {
				text-decoration: none;
			}
		}
	}

	& .react-calendar__tile {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		font-size: 1.2rem;
		font-weight: bold;
		color: #3eb1b8;
		flex-direction: column;
		overflow-y: hidden;

		&.react-calendar__tile--active,
		&.react-calendar__tile--now {
			background: none;
			color: #3eb1b8;

			&:enabled:hover,
			&:enabled:focus {
				background: none;
				color: #3eb1b8;
			}
		}

		&.react-calendar__tile--now {
			background: rgba(62, 177, 184, 0.2);
		}

		&.react-calendar__tile--active,
		&:hover {
			background: #3eb1b8;
			color: #fff;
			border-radius: full;

			&:enabled:hover,
			&:enabled:focus {
				background: #3eb1b8;
				color: #fff;
			}
		}

		&.react-calendar__tile--neighboringMonth {
			opacity: 0.5;
		}
	}

	@media (max-width: 768px) {
		& .react-calendar__navigation {
			font-size: 1rem;
		}

		& .react-calendar__tile {
			font-size: 1rem;
			padding: 0.5rem;
		}
	}

	@media (max-width: 480px) {
		& .react-calendar__navigation {
			font-size: 0.8rem;
		}

		& .react-calendar__tile {
			font-size: 0.8rem;
			padding: 0.3rem;
		}
	}
`;

const MeetingDot = styled.div`
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: -1;

	background-color: #3eb1b8;
`;
