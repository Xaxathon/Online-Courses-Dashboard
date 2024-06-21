import React from "react";

const Settings = () => {
	return (
		<div className="mt-7 w-full mr-4 px-10">
			<h1 className="w-full font-bold mx-auto text-mainPurple text-2xl  py-3 rounded-xl bg-gray-100 flex items-center justify-center px-7 ">
				Настройки
			</h1>
			<div className="flex flex-col gap-5 mt-10 px-5">
				<h2 className="w-full font-bold mx-auto text-mainPurple text-base cursor-pointer  py-4 rounded-xl bg-gray-100 flex items-center justify-start px-7 ">
					Ключевые слова
				</h2>
				<h2 className="w-full font-bold mx-auto text-mainPurple text-base cursor-pointer  py-4 rounded-xl bg-gray-100 flex items-center justify-start px-7 ">
					Данные о пользователях
				</h2>
			</div>
		</div>
	);
};

export default Settings;
