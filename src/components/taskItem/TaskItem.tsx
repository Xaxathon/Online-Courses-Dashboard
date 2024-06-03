import React from "react";

const TaskItem = () => {
	return (
		<li className="grid grid-cols-5 xl:text-[14px] text-[10px] bg-gray-100 items-center justify-center rounded-lg text-center p-5 w-full min-h-[60px] text-statusRed mb-3">
			<div className="col-span-5 md:col-span-1">
				Отправить протокол ИК Иванову
			</div>
			<div className="col-span-5 md:col-span-1">Чантиева Иман Магомедовна</div>
			<div className="col-span-5 md:col-span-1">02.09.2023</div>
			<div className="col-span-5 md:col-span-1">В процессе</div>
			<div className="col-span-5 md:col-span-1 flex justify-center">
				<span className="text-black font-bold xl:border-2 border-[1px] rounded-lg border-statusSalate xl:w-[78px] xl:h-[39px] w-[55px] h-[30px] flex items-center justify-center">
					1
				</span>
			</div>
		</li>
	);
};

export default TaskItem;
