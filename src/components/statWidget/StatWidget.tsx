import React from "react";

const StatWidget = () => {
	return (
		<div className="w-[198px] h-[85px] bg-gray-100 rounded-lg pl-2 pt-2">
			<div className="text-[13px]">Статистика протоколов</div>
			<div className="flex space-x-5">
				<div className="flex space-y-1 flex-col text-[11px] font-bold mt-1">
					<div className="flex items-center">
						<p className="text-[10px] font-[400]">В процессе</p>
						<span className="ml-2 text-purple-600">1433</span>
					</div>
					<div className="flex items-center">
						<p className="text-[10px] font-[400]">Готово</p>
						<span className="ml-2 text-green-600">2333445</span>
					</div>
				</div>
				<div className="w-[50px] h-[50px] bg-gray-200 rounded-full"></div>
			</div>
		</div>
	);
};

export default StatWidget;
