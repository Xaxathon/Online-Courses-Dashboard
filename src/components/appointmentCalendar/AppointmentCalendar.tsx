import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Calendar as LibCalendar, CalendarProps } from "react-calendar";
import styled from "styled-components";

import dayjs from "dayjs";

import { Meeting } from "../../shared/interfaces/meeting";

interface CustomCalendarProps {
	onDateChange: (date: Date) => void;
	onMonthChange: (month: Date) => void;
	meetings: Meeting[];
}

const AppointmentCalendar: React.FC<CustomCalendarProps> = ({
	onDateChange,
	onMonthChange,
	meetings,
}) => {
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
			// Если дата не указана в URL, используем текущую дату
			const currentDate = dayjs().startOf("day").toDate();
			setDate(currentDate);
			// Обновляем URL с текущей датой
			navigate(
				`/main/calendar?date=${dayjs(currentDate).format("YYYY-MM-DD")}`,
				{ replace: true }
			);
		}
	}, [location.search]);

	const handleDateChange: CalendarProps["onChange"] = useCallback(
		(value: any) => {
			if (value instanceof Date) {
				const newDate = dayjs(value).startOf("day").toDate();
				setDate(newDate);
				onDateChange(newDate);
				navigate(`/main/calendar?date=${dayjs(newDate).format("YYYY-MM-DD")}`);
			}
		},
		[onDateChange, navigate]
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
		({ date: tileDate, view }: { date: Date; view: string }) => {
			if (view === "month" && Array.isArray(meetings)) {
				const dayMeetings = meetings.filter((meeting) =>
					dayjs(meeting.event_date).isSame(dayjs(tileDate), "day")
				);
				return (
					<div>
						{dayMeetings.map((meeting) => (
							<Event key={meeting.id}>
								{meeting.theme && meeting.theme.length > 7
									? `${meeting.theme.slice(0, 6)}...`
									: meeting.theme}{" "}
							</Event>
						))}
					</div>
				);
			}
			return null;
		},
		[meetings]
	);

	const tileClassName = useCallback(
		({ date: tileDate, view }: { date: Date; view: string }) => {
			if (view === "month") {
				return dayjs(tileDate).isSame(date, "day") ? "selected-date" : "";
			}
			return "";
		},
		[date]
	);

	const renderMonthLabel = useCallback(
		(locale: string | undefined, date: Date) => {
			return dayjs(date).format("MMMM");
		},
		[]
	);

	return (
		<CalendarContainer>
			<StyledCalendar
				onChange={handleDateChange}
				value={date}
				prevLabel={<span>&lt;</span>}
				nextLabel={<span>&gt;</span>}
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

export default AppointmentCalendar;

// Styled components (updated)

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
		padding: 0 12.5rem;
		justify-content: center;
		align-items: center;
		font-size: 1.3rem;
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
		font-size: 1.2rem;
		font-weight: bold;
		color: #779f7c;
		text-decoration: none;
		margin-bottom: 1.2rem;

		& .react-calendar__month-view__weekdays__weekday {
			padding: 0.6rem 0;

			abbr {
				text-decoration: none;
			}
		}
	}

	& .react-calendar__tile {
		height: 6.2rem;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		position: relative;
		padding: 0.6rem;
		font-size: 1.2rem;
		font-weight: bold;
		color: #3eb1b8;
		flex-direction: column;
		overflow-y: hidden;

		&.react-calendar__tile--active {
			background: #68a7f5;
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
`;

const Event = styled.div`
	background-color: #7130a3;
	color: #fff;
	padding: 0.4rem 0.8rem;
	border-radius: 1.2rem;
	margin: 0.2rem auto;
	display: inline-block;
	font-size: 1rem;
	font-weight: 500;
`;
