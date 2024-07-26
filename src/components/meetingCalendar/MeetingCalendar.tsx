import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Calendar as LibCalendar, CalendarProps } from "react-calendar";
import styled from "styled-components";

import dayjs from "dayjs";

import { Meeting } from "@/shared/interfaces/meeting";

interface CustomCalendarProps {
	onDateChange: (date: Date) => void;
	onMonthChange: (month: Date) => void;
	meetings: Meeting[];
}

const MeetingCalendar = ({
	onDateChange,
	onMonthChange,
	meetings,
}: CustomCalendarProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [date, setDate] = useState<Date>(() => {
		const params = new URLSearchParams(location.search);
		const dateParam = params.get("date");
		return dateParam
			? dayjs(dateParam).startOf("day").toDate()
			: dayjs().startOf("day").toDate();
	});

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const dateParam = params.get("date");
		if (dateParam) {
			setDate(dayjs(dateParam).startOf("day").toDate());
		} else {
			const currentDate = dayjs().startOf("day").toDate();
			setDate(currentDate);

			navigate(
				`/main/meetings?date=${dayjs(currentDate).format("YYYY-MM-DD")}`,
				{ replace: true }
			);
		}
	}, [location.search]);

	const handleDateChange: CalendarProps["onChange"] = (value) => {
		if (value instanceof Date) {
			const newDate = dayjs(value).startOf("day").toDate();
			setDate(newDate);
			onDateChange(newDate);
			navigate(`/main/meetings?date=${dayjs(newDate).format("YYYY-MM-DD")}`);
		}
	};

	const handleActiveStartDateChange: CalendarProps["onActiveStartDateChange"] =
		({ activeStartDate }: { activeStartDate: Date | null }) => {
			if (activeStartDate) {
				onMonthChange(activeStartDate);
			}
		};

	const tileContent = ({
		date: tileDate,
		view,
	}: {
		date: Date;
		view: string;
	}) => {
		if (view === "month" && Array.isArray(meetings)) {
			const dayMeetings = meetings.filter((meeting) =>
				dayjs(meeting.event_date).isSame(dayjs(tileDate), "day")
			);
			const visibleMeetings = dayMeetings.slice(0, 2);

			return (
				<EventsContainer>
					{visibleMeetings.map((meeting) => (
						<Event key={meeting.id} title={meeting.theme}>
							{meeting.theme}
						</Event>
					))}
				</EventsContainer>
			);
		}
		return null;
	};

	const tileClassName = ({
		date: tileDate,
		view,
	}: {
		date: Date;
		view: string;
	}) => {
		if (view === "month") {
			return dayjs(tileDate).isSame(date, "day") ? "selected-date" : "";
		}
		return "";
	};

	const renderMonthLabel = (_: string | undefined, date: Date) => {
		return dayjs(date).format("MMMM");
	};

	return (
		<CalendarContainer>
			<StyledCalendar
				onChange={handleDateChange}
				value={date}
				prevLabel={
					<span className="hover:text-mainPurpleHover active:text-mainPurpleActive">
						&lt;
					</span>
				}
				nextLabel={
					<span className="hover:text-mainPurpleHover active:text-mainPurpleActive">
						&gt;
					</span>
				}
				prev2Label={null}
				next2Label={null}
				navigationLabel={({ date }) => renderMonthLabel("ru-RU", date)}
				formatMonthYear={renderMonthLabel}
				tileContent={tileContent}
				tileClassName={tileClassName}
				onActiveStartDateChange={handleActiveStartDateChange}
			/>
		</CalendarContainer>
	);
};

export default MeetingCalendar;

const CalendarContainer = styled.div`
	max-width: 100%;
	height: clamp(31.3rem, calc(100vh - 3.8rem), 100vh);
	box-shadow: 0.3rem 0.3rem 1.3rem rgba(0, 0, 0, 0.25);
	border-radius: 1.6rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(
		180deg,
		rgba(234, 207, 255, 0.63) 0.55%,
		rgba(231, 249, 255, 0.54) 100%
	);
	padding: 1rem;

	@media (max-width: 1024px) {
		height: auto;
		min-height: 70vh;
	}
`;

const StyledCalendar = styled(LibCalendar)`
	background: none;
	width: 100%;
	height: 100%;
	border: none;
	background-color: transparent;
	font-family: "Poppins", sans-serif;

	& .react-calendar__navigation {
		display: flex;
		padding: 0 5%;
		margin: 1rem 0;
		justify-content: space-between;
		align-items: center;
		font-size: clamp(1rem, 2vw, 1.3rem);
		font-weight: 600;
		color: #7130a3;
		background: none;
		border: none;
		position: relative;

		& .react-calendar__navigation__label {
			color: #7130a3;
			display: inline;
			text-transform: capitalize;
			margin: 0 0.6rem;
		}

		& button {
			color: #a3a3a3;
		}
	}

	& .react-calendar__month-view__weekdays {
		text-align: center;
		font-size: clamp(0.8rem, 1.5vw, 1.5rem);
		font-weight: bold;
		color: #779f7c;
		text-decoration: none;
		margin-bottom: 0.5rem;

		& .react-calendar__month-view__weekdays__weekday {
			padding: 0.2rem 0;

			abbr {
				text-decoration: none;
			}
		}
	}

	& .react-calendar__tile {
		height: clamp(4rem, 10vw, 6.2rem);
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		position: relative;
		padding: 0.3rem;
		font-size: clamp(0.8rem, 1.2vw, 1.2rem);
		font-weight: bold;
		color: #3eb1b8;
		flex-direction: column;
		overflow-y: hidden;
		transition: opacity 0.3s ease;

		&:hover {
			background-color: rgb(212, 251, 253);
		}

		&.react-calendar__tile--active {
			background: #3eb1b8;
			color: #fff;

			&:enabled:hover,
			&:enabled:focus {
				background: #3eb1b8;
			}
		}

		&.out-of-month {
			opacity: 0.3;
		}
	}

	@media (max-width: 768px) {
		& .react-calendar__navigation {
			padding: 0 2%;
		}

		& .react-calendar__tile {
			height: clamp(2rem, 8vw, 5rem);
			padding: 0.2rem;
		}
	}
`;

const EventsContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
`;

const Event = styled.div`
	display: inline-block;
	margin-bottom: 0 auto;
	text-align: start;
	background-color: #7130a3;
	margin-bottom: 0.1rem;
	color: #fff;
	padding: 0.2rem;
	border-radius: 0.5rem;
	font-size: clamp(0.6rem, 1vw, 0.7rem);
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
`;
