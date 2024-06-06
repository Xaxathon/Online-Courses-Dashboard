import React from "react";
import Participant from "@assets/img/participant.jpg";

const SettingsForm = () => {
	return (
		<form action="">
			<div className="flex space-x-3 font-bold items-center">
				<label className="text-statusSalate text-[17px]" htmlFor="subject">
					ФИО:
				</label>
				<input
					className="w-[282px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
					id="subject"
					type="text"
				/>
			</div>
			<div className="flex mt-[30px] justify-between">
				<div className="h-[190px] w-[190px] mr-3 bg-[#EAE8F1] flex flex-col items-center  justify-center rounded-lg">
					<img
						src={Participant}
						alt="/"
						className="w-[141px] h-[141px] rounded-lg object-cover"
					/>
					<span className=" w-[112px] text-[13px] font-normal leading-none text-mainPurple mt-1 text-center">
						Нажмите, чтобы изменить фото
					</span>
				</div>
				<div className="grid grid-cols-2 grid-rows-2 gap-5 font-bold justify-around">
					<div className="flex flex-col space-y-[5px]">
						<label className="text-statusSalate text-[17px]" htmlFor="subject">
							Наименование отдела
						</label>
						<input
							className="w-[398px] h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="subject"
							type="text"
						/>
					</div>
				</div>
			</div>
			<div className="w-full flex justify-end mt-4">
				<button className=" rounded-[12px] px-[60px] py-2 bg-mainPurple text-white text-xl font-bold">
					Изменить
				</button>
			</div>
		</form>
	);
};

export default SettingsForm;