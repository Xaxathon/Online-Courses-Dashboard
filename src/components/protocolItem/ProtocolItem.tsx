import React from "react";

const ProtocolItem = () => {
	return (
		<li className=" grid grid-cols-5-protocol-cols justify-center items-center lg:text-sm  text-xs text-center bg-gray-100 p-5 text-mainPurple  rounded-lg">
			<div className="col-span-5 md:col-span-1">
				Создание благоприятных условий для детей в образовательном центре Север
			</div>
			<div className="col-span-5 md:col-span-1">Чантиева Иман Магомедовна</div>
			<div className="col-span-5 md:col-span-1">02.09.2023</div>
			<div className="col-span-5 md:col-span-1 flex justify-center">
				<span className="text-black font-bold xl:border-2 border-[1px] rounded-lg border-statusSalate px-5 py-2 flex items-center justify-center">
					3
				</span>
			</div>
			<div className="col-span-5 md:col-span-1">В процессе</div>
		</li>
	);
};

export default ProtocolItem;
