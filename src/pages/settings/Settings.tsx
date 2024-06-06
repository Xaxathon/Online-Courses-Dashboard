import React from "react";

const Settings = () => {
	return (
		<div className="mt-[30px] w-full mr-4">
			<h1 className="w-full font-bold mx-auto text-mainPurple text-[24px] max-w-[1245px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-center px-[30px] ">
				Настройки
			</h1>
			<div className="flex flex-col space-y-5 mt-[50px]">
				<h2 className="w-full font-bold mx-auto text-mainPurple text-[17px] cursor-pointer  max-w-[1100px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-start px-[30px] ">
					Ключевые слова
				</h2>
				<h2 className="w-full font-bold mx-auto text-mainPurple text-[17px] cursor-pointer  max-w-[1100px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-start px-[30px] ">
					Данные о пользователях
				</h2>
			</div>
		</div>
	);
};

export default Settings;
