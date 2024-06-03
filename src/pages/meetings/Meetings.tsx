import React from "react";
import KpiChart from "../../components/kpiChart/KpiChart";
import Calendar from "../../components/calendar/Calendar";
import StatWidget from "../../components/statWidget/StatWidget";
import TaskList from "../../components/taskList/TaskList";
import Search from "@assets/icons/search.svg";

const Meetings = () => {
	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-[minmax(427px,_475px)_minmax(437px,_780px)] gap-[30px] mr-[15px] mt-[25px]">
				<div className="grid grid-rows-[359px_296px_85px] gap-[15px] max-lg:w-[475px] ">
					<Calendar />
					<KpiChart />
					<div className="flex space-x-[36px] items-center justify-center">
						<StatWidget />
						<StatWidget />
					</div>
				</div>
				<div className=" max-lg:w-[780px] mt-[15px] ">
					<div className="flex bg-gray-100 rounded-lg justify-center items-center px-3 w-full xl:max-w-[787px] h-[46px] mb-[20px]">
						<input
							className="bg-transparent p-2 w-full focus:outline-none"
							type="text"
							placeholder="Введите запрос"
						/>
						<Search />
					</div>
					<ul className="w-full grid grid-cols-5 font-bold items-center justify-center xl:text-[17px] text-[11px]  text-center p-4 text-mainPurple ">
						<li className="col-span-5 md:col-span-1">Задача</li>
						<li className="col-span-5 md:col-span-1">Ответственный</li>
						<li className="col-span-5 md:col-span-1">Дедлайн</li>
						<li className="col-span-5 md:col-span-1">Статус</li>
						<li className="col-span-5 md:col-span-1">№Протокола</li>
					</ul>
					<TaskList />
				</div>
			</div>
		</div>
	);
};

export default Meetings;
