import React from "react";
import StatWidget from "../statWidget/StatWidget";
import Left from "@assets/icons/left-arrow.svg";
import Right from "@assets/icons/right-arrow.svg";
import Rectangle from "@assets/img/Rectangle.jpg";

const SecretaryCarousel = () => {
	return (
		<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 ">
			<div className="w-full bg-time-gradient py-3 px-5 rounded-lg">
				<div className="flex space-x-5 text-black font-normal text-xs">
					<img
						src={Rectangle}
						alt=""
						className="w-20 h-20 rounded-lg object-cover"
					/>

					<div className="flex flex-col gap-1">
						<h2 className="text-mainPurple font-bold text-base">
							Николенко Антонина Сергеевна
						</h2>
						<span>Секретарь</span>
						<span>Отдел аналитики</span>
					</div>
				</div>
			</div>
			<div className="relative w-full px-9">
				<Left className="absolute -left-1 top-1/2 w-9 h-9" />
				<div className=" h-[296px] bg-gray-700 rounded-xl mt-4"></div>
				<Right className="absolute -right-1 top-1/2 w-9 h-9" />
			</div>
			<div className="flex gap-5 mt-5 flex-wrap justify-center">
				<StatWidget />
				<StatWidget />
			</div>
			<div className="mt-2">fkdkf</div>
		</div>
	);
};

export default SecretaryCarousel;
