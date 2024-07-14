import React, { useState, useMemo } from "react";
import { ReactComponent as Left } from "@assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@assets/icons/right-arrow.svg";
import AvatarError from "@assets/img/avatar.jpg";

import StatWidget from "../statWidget/StatWidget";
import Skeleton from "../skeleton/Skeleton";
import KpiChart from "../kpiChart/KpiChart";

import {
	useFetchEntityStatsQuery,
	useFetchKpiTasksStatsQuery,
} from "@/api/statsApi";
import { BaseUser } from "@/shared/interfaces/user";

interface SecretaryCarouselProps {
	userData: BaseUser | undefined;
	onLeftClick: () => void;
	onRightClick: () => void;
}

const SecretaryCarousel = ({
	userData,
	onLeftClick,
	onRightClick,
}: SecretaryCarouselProps) => {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

	const { data: entityStats, isLoading: isLoadingEntityStats } =
		useFetchEntityStatsQuery(userData?.id || 0, {
			skip: !userData?.id,
		});

	const formattedDate = useMemo(() => {
		return currentMonth.toISOString().slice(0, 7); // format: "YYYY-MM"
	}, [currentMonth]);

	const { data: kpiStats, isLoading: isLoadingKpiStats } =
		useFetchKpiTasksStatsQuery(
			{
				secretaryId: userData?.id || 0,
				date: formattedDate,
			},
			{
				skip: !userData?.id,
			}
		);

	const formattedKpiData = useMemo(() => {
		if (!kpiStats) return [];
		return Object.entries(kpiStats).map(([week, data]) => ({
			week: `${week} неделя`,
			in_process: data.in_process,
			success: data.success,
			expired: data.expired,
		}));
	}, [kpiStats]);

	const handleMonthChange = (newDate: Date) => {
		setCurrentMonth(newDate);
	};

	if (!userData) {
		return (
			<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5">
				<Skeleton width="20" height="20" className="rounded-lg mb-4" />
				<Skeleton width="3/4" height="6" className="mb-2" />
				<Skeleton width="1/2" height="4" className="mb-2" />
				<Skeleton width="1/2" height="4" />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 ">
			<div className="w-full bg-time-gradient py-3 px-5 rounded-lg">
				<div className="flex space-x-5 text-black font-normal text-xs">
					<img
						src={userData.avatar || AvatarError}
						alt="avatar"
						className="w-20 h-20 rounded-lg object-cover"
					/>
					<div className="flex flex-col gap-1">
						<h2 className="text-mainPurple font-bold text-base">
							{userData.full_name ?? "Ошибка получения имени"}
						</h2>
						<span>{userData.role ? "Секретарь" : "Ошибка получения роли"}</span>
						<span>{userData.department ?? "Ошибка получения отдела"}</span>
					</div>
				</div>
			</div>
			<div className="relative w-full px-9 mt-5">
				<Left
					className="absolute -left-1 top-1/2 w-9 h-9 cursor-pointer"
					onClick={onLeftClick}
				/>
				<div className="flex justify-center items-center">
					<KpiChart
						data={formattedKpiData}
						isLoading={isLoadingKpiStats}
						currentMonth={currentMonth}
						onMonthChange={handleMonthChange}
					/>
				</div>
				<Right
					className="absolute -right-1 top-1/2 w-9 h-9 cursor-pointer"
					onClick={onRightClick}
				/>
			</div>
			<div className="flex gap-5 mt-5 flex-wrap justify-center">
				{isLoadingEntityStats && (
					<div className="flex gap-2 mt-2">
						<Skeleton width="20" height="10" className="rounded-lg" />
						<Skeleton width="20" height="10" className="rounded-lg" />
					</div>
				)}
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
	);
};

export default SecretaryCarousel;
