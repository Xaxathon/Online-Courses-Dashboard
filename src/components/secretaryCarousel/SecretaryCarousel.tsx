import React from "react";
import StatWidget from "../statWidget/StatWidget";
import Left from "@assets/icons/left-arrow.svg";
import Right from "@assets/icons/right-arrow.svg";
import Rectangle from "@assets/img/Rectangle.jpg";

const SecretaryCarousel = () => {
	return (
		<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 ">
			<div className="w-full bg-time-gradient py-[10px] px-5 rounded-lg">
				<div className="flex space-x-5 text-black font-normal text-[12px]">
					<div className="flex items-center justify-center w-[88px] h-[95px] p-1 bg-[#D5C0E5] rounded-lg">
						<img
							src={Rectangle}
							alt=""
							className="w-full h-full object-cover rounded-lg"
						/>
					</div>
					<div className="flex flex-col space-y-1">
						<h2 className="text-mainPurple font-bold text-[16px]">
							Николенко Антонина Сергеевна
						</h2>
						<span>Секретарь</span>
						<span>Отдел аналитики</span>
					</div>
				</div>
			</div>
			<div className="relative w-full px-9    ">
				<Left className="absolute -left-1 top-1/2" />
				<div className=" h-[296px] bg-gray-700 rounded-[10px] mt-4"></div>
				<Right className="absolute -right-1 top-1/2" />
			</div>
			<div className="flex space-x-5 mt-5">
				<StatWidget />
				<StatWidget />
			</div>
			<div className="mt-2">fkdkf</div>
		</div>
	);
};

export default SecretaryCarousel;
