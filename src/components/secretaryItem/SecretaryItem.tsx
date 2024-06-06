import React from "react";
import StatWidget from "../statWidget/StatWidget";
import Rectangle from "@assets/img/Rectangle.jpg";
const SecretaryItem = () => {
	return (
		<>
			<div className="w-[558px] bg-custom-gradient  py-[10px] px-5 rounded-lg">
				<div className="flex space-x-5 text-black font-normal text-[12px]">
					<div className="flex items-center justify-center w-[88px] h-[95px] bg-[#D5C0E5] rounded-lg">
						<img
							src={Rectangle}
							alt=""
							className="w-[78px] h-[84px] rounded-lg"
						/>
					</div>
					<div className="max-w-[400px] flex flex-col space-y-1">
						<h2 className="text-mainPurple font-bold text-[16px]">
							Николенко Антонина Сергеевна
						</h2>
						<span>Секретарь</span>
						<span>Отдел аналитики</span>
					</div>
				</div>
				<button className="block mx-auto mt-[10px] bg-mainPurple text-[10px] text-white px-2 py-1 rounded-lg">
					Посмотреть статистику
				</button>
			</div>
			<div className="w-[558px] bg-custom-gradient py-[10px] px-5 rounded-lg">
				<div className="flex space-x-5 text-black font-normal text-[12px]">
					<div className="flex items-center justify-center w-[88px] h-[95px] bg-[#D5C0E5] rounded-lg">
						<img
							src={Rectangle}
							alt=""
							className="w-[78px] h-[84px] rounded-lg"
						/>
					</div>
					<div className="max-w-[400px] flex flex-col space-y-1">
						<h2 className="text-mainPurple font-bold text-[16px]">
							Николенко Антонина Сергеевна
						</h2>
						<span>Секретарь</span>
						<span>Отдел аналитики</span>
					</div>
				</div>
				<div className="flex items-center justify-center space-x-5 mt-[10px]">
					<StatWidget />
					<StatWidget />
				</div>
				<button className="block mx-auto mt-[10px] bg-mainPurple text-[10px] text-white px-2 py-1 rounded-lg">
					Скрыть статистику
				</button>
			</div>
		</>
	);
};

export default SecretaryItem;
