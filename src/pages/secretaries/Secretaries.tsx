import React from "react";
import SecretaryList from "../../components/secretaryList/SecretaryList";
import KpiChart from "../../components/kpiChart/KpiChart";
import Search from "@assets/icons/search.svg";

const Secretaries = () => {
	return (
		<div className="grid grid-cols-2 w-full gap-10 mt-[20px] mr-6">
			<div className="">
				<div className="text-[18px] text-mainPurple bg-gray-100 py-4 px-8 rounded-lg">
					Дашборд менеджера:{" "}
					<span className="font-bold">Иванов Иван Иванович</span>
				</div>
				<div className="mt-10">
					<KpiChart />
				</div>
			</div>
			<div>
				<div className="flex bg-gray-100 mt-2 rounded-lg justify-center items-center px-3 w-full xl:max-w-[787px] h-[46px] mb-[20px]">
					<input
						className="bg-transparent p-2 w-full focus:outline-none"
						type="text"
						placeholder="Введите запрос"
					/>
					<Search />
				</div>
				<SecretaryList />
			</div>
		</div>
	);
};

export default Secretaries;
