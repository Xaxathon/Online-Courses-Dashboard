import { useState, useCallback, useEffect, ChangeEvent, useMemo } from "react";
import { useSelector } from "react-redux";

import { ReactComponent as Search } from "@assets/icons/search.svg";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

import CalendarWrapper from "@components/calendarMeetingWrapper/CalendarMeetingWrapper";
import KpiChart from "@components/kpiChart/KpiChart";
import StatWidget from "@components/statWidget/StatWidget";
import ProtocolTaskList from "@components/protocoltaskList/ProtocolTaskList";

import dayjs from "dayjs";
import debounce from "lodash/debounce";

import { getStartOfMonth, getEndOfMonth } from "@/utils/dateUtils";

import { RootState } from "@/store/store";

import {
	useFetchEntityStatsQuery,
	useFetchKpiTasksStatsQuery,
	useFetchMeetingStatsQuery,
} from "@/api/statsApi";

const DEBOUNCE_DELAY = 1000;

const MainPage = () => {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [kpiMonth, setKpiMonth] = useState<Date>(new Date());
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	const userId = useSelector((state: RootState) => state.auth.user?.id);

	const start_date_at = getStartOfMonth(currentMonth);
	const end_date_at = getEndOfMonth(currentMonth);

	const { data: entityStats } = useFetchEntityStatsQuery(userId || 0, {
		skip: !userId,
	});

	const { data: kpiStats, isLoading: isKpiLoading } =
		useFetchKpiTasksStatsQuery(
			{
				secretaryId: userId || 0,
				date: dayjs(kpiMonth).format("YYYY-MM"),
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

	useEffect(() => {
		refetchMeetingStats();
	}, [currentMonth, refetchMeetingStats]);

	const formattedKpiData = useMemo(() => {
		if (!kpiStats) return [];
		return Object.entries(kpiStats).map(([week, data]) => ({
			week: `${week} неделя`,
			in_process: data.in_process,
			success: data.success,
			expired: data.expired,
		}));
	}, [kpiStats]);

	const debouncedSearch = useCallback(
		debounce((term: string) => {
			setSearchTerm(term);
			setIsSearching(false);
		}, DEBOUNCE_DELAY),
		[]
	);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value;
		setIsSearching(true);
		debouncedSearch(term);
	};

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);
	};

	const handleMonthChange = (date: Date) => {
		setCurrentMonth(date);
	};

	const handleKpiMonthChange = (date: Date) => {
		setKpiMonth(date);
	};

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

				<KpiChart
					data={formattedKpiData}
					isLoading={isKpiLoading}
					currentMonth={kpiMonth}
					onMonthChange={handleKpiMonthChange}
				/>
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
				<ProtocolTaskList searchTerm={searchTerm} />
			</div>
		</div>
	);
};

export default MainPage;
