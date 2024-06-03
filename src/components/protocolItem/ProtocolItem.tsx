import React from "react";

const ProtocolItem = () => {
	return (
		<li className="max-w-[1245px] grid lg:grid-cols-[minmax(301px,440px)_minmax(179px,312px)_minmax(140px,140px)_minmax(124px,175px)_minmax(125px,178px)] justify-center items-center text-[14px] xl:text-[15px] text-center bg-gray-100 p-5 text-mainPurple  rounded-lg">
			<div className="col-span-5 md:col-span-1">
				Создание благоприятных условий для детей в образовательном центре Север
			</div>
			<div className="col-span-5 md:col-span-1">Чантиева Иман Магомедовна</div>
			<div className="col-span-5 md:col-span-1">02.09.2023</div>
			<div className="col-span-5 md:col-span-1 flex justify-center">
				<span className="text-black font-bold xl:border-2 border-[1px] rounded-lg border-statusSalate xl:w-[78px] xl:h-[39px] w-[55px] h-[30px] flex items-center justify-center">
					1
				</span>
			</div>
			<div className="col-span-5 md:col-span-1">В процессе</div>
		</li>
	);
};

export default ProtocolItem;
