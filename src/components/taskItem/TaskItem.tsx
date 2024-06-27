import React from "react";

const TaskItem = () => {
	return (
		<ul className="grid grid-cols-5 xl:text-sm relative text-xs bg-gray-100 items-center justify-center rounded-lg text-center p-4 w-full text-crimsonRed mb-3">
			<li className="col-span-1 text-start">
				Создание gsfg fsdf условий для для для для для для
			</li>
			<li className="col-span-1">Чантиева Иман Магомедовна</li>
			<li className="col-span-1">02.09.2023</li>
			<li className="col-span-1">В процессе</li>
			<li className="col-span-1 flex justify-center">
				<span className="text-black font-bold xl:border-2 border rounded-lg border-gardenGreen px-5 py-2 flex items-center justify-center">
					1
				</span>
			</li>
		</ul>
	);
};

export default TaskItem;
