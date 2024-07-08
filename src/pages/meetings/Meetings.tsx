import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import { ReactComponent as Search } from "@assets/icons/search.svg";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

import CalendarWrapper from "../../components/calendarMeetingWrapper/CalendarMeetingWrapper";
import KpiChart from "../../components/kpiChart/KpiChart";
import StatWidget from "../../components/statWidget/StatWidget";
import TaskList from "../../components/taskList/TaskList";

import dayjs from "dayjs";
import debounce from "lodash/debounce";

import { getStartOfMonth, getEndOfMonth } from "../../utils/dateUtils";

import { RootState } from "../../store/store";

import {
	useFetchEntityStatsQuery,
	useFetchKpiTasksStatsQuery,
	useFetchMeetingStatsQuery,
} from "../../api/statsApi";

const DEBOUNCE_DELAY = 1000;

const Meetings = () => {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	const userId = useSelector((state: RootState) => state.auth.user?.id);

	const start_date_at = getStartOfMonth(currentMonth);
	const end_date_at = getEndOfMonth(currentMonth);

	const { data: entityStats } = useFetchEntityStatsQuery(userId || 0, {
		skip: !userId,
	});

	const formattedDate = dayjs(currentMonth).format("YYYY-MM");

	const { data: kpiStats } = useFetchKpiTasksStatsQuery(
		{
			secretaryId: userId || 0,
			date: formattedDate,
		},
		{
			skip: !userId,
		}
	);

	const { data: meetingStats, refetch: refetchMeetingStats } =
		useFetchMeetingStatsQuery(
			{
				start_date_at,
				end_date_at,
			},
			{
				skip: !userId,
			}
		);

	const debouncedSearch = useCallback(
		debounce((term: string) => {
			setSearchTerm(term);
			setIsSearching(false);
		}, DEBOUNCE_DELAY),
		[]
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value;
		setIsSearching(true);
		debouncedSearch(term);
	};

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);
	};

	const handleMonthChange = useCallback((date: Date) => {
		setCurrentMonth(date);
	}, []);

	useEffect(() => {
		refetchMeetingStats();
	}, [currentMonth, refetchMeetingStats]);

	// Преобразуем meetingStats в массив дат
	const meetingDates = meetingStats
		? meetingStats.map((meeting) => new Date(meeting.event_date))
		: [];

	return (
		<div className="grid grid-cols-[minmax(20rem,_30rem)_minmax(30rem,_70rem)] gap-6 px-4 mt-7">
			<div className="flex w-full flex-col gap-2 ">
				<div className="max-w-[30rem] rounded-xl flex justify-center items-center">
					<CalendarWrapper
						value={selectedDate}
						onChange={handleDateChange}
						onMonthChange={handleMonthChange}
						meetingDates={meetingDates}
					/>
				</div>

				<KpiChart data={kpiStats || []} />
				<div className="flex gap-5 items-center justify-center">
					{entityStats && (
						<>
							<StatWidget
								title="Статистика совещаний"
								inProcess={entityStats.meetings.in_process}
								success={entityStats.meetings.success}
							/>
							<StatWidget
								title="Статистика протоколов"
								inProcess={entityStats.protocols.in_process}
								success={entityStats.protocols.success}
							/>
						</>
					)}
				</div>
			</div>
			<div className="">
				<div className="flex justify-center items-center w-full bg-gray-100 mt-2 rounded-lg px-3 py-1 mb-5">
					<input
						className="bg-transparent p-2 w-full focus:outline-none"
						type="text"
						placeholder="Введите запрос"
						onChange={handleSearchChange}
					/>
					{isSearching ? (
						<Spinner className="w-6 h-6 animate-spin" />
					) : (
						<Search className="w-6 h-6" />
					)}
				</div>

				<ul className="flex justify-around font-bold  xl:text-lg text-xs  text-center text-mainPurple mb-2">
					<li>Задача</li>
					<li>Ответственный</li>
					<li>Дедлайн</li>
					<li>Статус</li>
					<li>№Протокола</li>
				</ul>
				<TaskList searchTerm={searchTerm} />
			</div>
		</div>
	);
};

export default Meetings;
