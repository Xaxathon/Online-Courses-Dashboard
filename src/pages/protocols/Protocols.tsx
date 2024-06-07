import React from "react";

import AddProtocolIcon from "@assets/icons/addProtocol.svg";
import ProtocolList from "../../components/protocolList/ProtocolList";
const Protocols = () => {
	return (
		<div className=" mr-[15px] mt-[35px] space-y-[15px]">
			<div className="font-bold text-mainPurple text-[24px] max-w-[1245px] h-[51px] rounded-xl bg-gray-100 flex justify-between items-center px-[30px] ">
				<h1>Протоколы</h1>
				<div className="flex items-center space-x-4">
					<h2>Создать новый протокол</h2>
					<AddProtocolIcon />
				</div>
			</div>
			<ul className="max-w-[1245px] px-5 grid lg:grid-cols-[minmax(301px,440px)_minmax(179px,312px)_minmax(140px,140px)_minmax(124px,175px)_minmax(125px,178px)] font-bold  justify-center xl:text-[17px] text-[15px] text-center text-mainPurple ">
				<li className="col-span-5 md:col-span-1">Тема</li>
				<li className="col-span-5 md:col-span-1">Секретарь</li>
				<li className="col-span-5 md:col-span-1">Дата</li>
				<li className="col-span-5 md:col-span-1">№Протокола</li>
				<li className="col-span-5 md:col-span-1">Статус</li>
			</ul>
			<ProtocolList />
		</div>
	);
};

export default Protocols;
