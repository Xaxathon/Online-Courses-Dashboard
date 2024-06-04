import React from "react";

const ProtocolAddForm = () => {
	return (
		<form className="flex text-[20px] font-bold flex-col items-center text-mainPurple w-[532px]">
			<label className=" mb-2" htmlFor="subject">
				Тема
			</label>
			<input
				className="w-full h-[66px] mb-8 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
				id="subject"
				type="text"
			/>

			<label className="text-20 font-bold mb-2" htmlFor="agenda">
				Повестка
			</label>
			<input
				className="w-full h-[66px] mb-8 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
				id="agenda"
				type="text"
			/>

			<label className="text-20 font-bold mb-2" htmlFor="secretary">
				Секретарь
			</label>
			<input
				className="w-full h-[66px] mb-8 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
				id="secretary"
				type="text"
			/>

			<label className="text-20 font-bold mb-2" htmlFor="supervisor">
				Руководитель
			</label>
			<input
				className="w-full h-[66px] mb-8 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
				id="supervisor"
				type="text"
			/>

			<button className="p-2 rounded-lg bg-mainPurple text-white font-bold text-center">
				Создать протокол
			</button>
		</form>
	);
};

export default ProtocolAddForm;
