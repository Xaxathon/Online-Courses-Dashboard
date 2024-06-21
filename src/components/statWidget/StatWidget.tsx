import React from "react";

const StatWidget = () => {
	return (
		<div className="shadow bg-white rounded-lg px-3 py-2">
			<div className="text-sm">Статистика протоколов</div>
			<div className="flex gap-5">
				<div className="flex gap-1 flex-col text-xs font-bold mt-1">
					<div className="flex items-center ">
						<p className="text-xs font-medium">В процессе</p>
						<span className="ml-2 text-mainPurple">99999</span>
					</div>
					<div className="flex items-center">
						<p className="text-xs font-medium">Готово</p>
						<span className="ml-2 text-statusSalate">2335</span>
					</div>
				</div>
				<div className="w-[50px] h-[50px] bg-gray-400 rounded-full"></div>
			</div>
		</div>
	);
};

export default StatWidget;
