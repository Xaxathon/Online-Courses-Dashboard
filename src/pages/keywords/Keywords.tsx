import React from "react";
import Backward from "@assets/icons/backward.svg";
import Change from "@assets/icons/change.svg";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";

const Keywords = () => {
	return (
		<div className="mt-[30px] w-full mr-4">
			<div className="font-bold text-mainPurple mx-auto text-[24px] max-w-[1245px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-center relative px-[30px]">
				<div className="absolute left-0 ml-[30px] cursor-pointer">
					<Backward />
				</div>
				<h1 className="text-center w-full">Ключевые слова</h1>
				<div className="absolute right-0 mr-[50px] flex gap-4 cursor-pointer">
					<AddProtocolIcon />
				</div>
			</div>

			<div className="w-full grid grid-cols-2 items-center mt-10 gap-3 font-bold mx-auto text-mainPurple text-[17px] max-w-[1100px] h-[51px] rounded-xl bg-gray-100  px-[30px] ">
				<h2>Название</h2>
				<h2>Фраза</h2>
			</div>
			<div className="flex flex-col space-y-4 mt-10">
				<div className="w-full relative grid grid-cols-2 items-center pr-10 justify-center gap-3 mx-auto  text-statusSalate text-[15px] font-normal  max-w-[1100px] rounded-xl bg-gray-100 py-7  px-[30px] ">
					<span>Приветствие</span>
					<span> Фраз</span>
					<Change className="absolute top-50% right-5 cursor-pointer" />
				</div>
			</div>
		</div>
	);
};

export default Keywords;
