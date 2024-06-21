import React from "react";

const ProtocolAddForm = () => {
	return (
		<form className="max-w-[30rem] flex flex-col items-center xl:text-xl lg:text-lg font-bold text-mainPurple gap-8">
			<div className="flex flex-col items-center w-full">
				<label className="mb-2" htmlFor="subject">
					Тема
				</label>
				<input
					className="w-full px-3 py-4  bg-inputPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
					id="subject"
					type="text"
				/>
			</div>
			<div className="flex flex-col items-center w-full">
				<label className="mb-2" htmlFor="agenda">
					Повестка
				</label>
				<input
					className="w-full px-3 py-4  bg-inputPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
					id="agenda"
					type="text"
				/>
			</div>
			<div className="flex flex-col items-center w-full">
				<label className="mb-2" htmlFor="secretary">
					Секретарь
				</label>
				<input
					className="w-full px-3 py-4  bg-inputPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
					id="secretary"
					type="text"
				/>
			</div>
			<div className="flex flex-col items-center w-full">
				<label className="mb-2" htmlFor="supervisor">
					Руководитель
				</label>
				<input
					className="w-full px-3 py-4  bg-inputPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
					id="supervisor"
					type="text"
				/>
			</div>
			<button className="p-2 rounded-lg bg-mainPurple text-white font-bold">
				Создать протокол
			</button>
		</form>
	);
};

export default ProtocolAddForm;
