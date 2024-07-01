import React from "react";
import KpiChart from "../../components/kpiChart/KpiChart";
import Calendar from "../../components/calendar/Calendar";
import StatWidget from "../../components/statWidget/StatWidget";
import TaskList from "../../components/taskList/TaskList";
import { ReactComponent as Search } from "@assets/icons/search.svg";

const Meetings = () => {
	return (
		<div className="flex gap-6 px-4 mt-7">
			<div className="flex flex-col space-y-3 ">
				<Calendar />
				<KpiChart />
				<div className="flex gap-5 items-center justify-center">
					<StatWidget />
					<StatWidget />
				</div>
			</div>
			<div className="">
				<div className="flex justify-center items-center w-full bg-gray-100 mt-2 rounded-lg px-3 py-1 mb-5">
					<input
						className="bg-transparent p-2 w-full focus:outline-none"
						type="text"
						placeholder="Введите запрос"
					/>
					<Search className="w-6 h-6" />
				</div>

				<ul className="flex justify-around font-bold  xl:text-lg text-xs  text-center text-mainPurple mb-2">
					<li>Задача</li>
					<li>Ответственный</li>
					<li>Дедлайн</li>
					<li>Статус</li>
					<li>№Протокола</li>
				</ul>
				<TaskList />
			</div>
		</div>
	);
};

export default Meetings;
