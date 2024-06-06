import React from "react";
import Backward from "@assets/icons/backward.svg";

const Secretary = () => {
	return (
		<div>
			<div className="flex justify-between items-center space-x-3 text-[18px] text-mainPurple bg-gray-100 py-4 px-5 rounded-lg mt-[20px]">
				<div className=" cursor-pointer">
					<Backward />
				</div>
				<div>
					Дашборд менеджера:{" "}
					<span className="font-bold">Иванов Иван Иванович</span>
				</div>
			</div>
			<div>ТУТ ДОЛЖЕН БЫТЬ КАРУСЕЛЬ!!!</div>
		</div>
	);
};

export default Secretary;
