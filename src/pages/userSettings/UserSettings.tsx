import React from "react";
import Backward from "@assets/icons/backward.svg";
import SecretariesForm from "../../components/secretariesForm/SecretariesForm";
import SettingsForm from "../../components/settingsForm/SettingsForm";

const UserSettings = () => {
	return (
		<div className=" mt-[30px] w-full mr-4 mb-20">
			<div className="font-bold text-mainPurple mx-auto text-[24px] max-w-[1245px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-center relative px-[30px]">
				<div className="absolute left-0 ml-[30px] cursor-pointer">
					<Backward />
				</div>
				<h1 className="text-center w-full">Данные о пользователях</h1>
			</div>
			<div className="mt-[40px]">
				<h2 className="font-bold text-mainPurple mx-auto text-[24px] text-center">
					Мой профиль
				</h2>

				<div className="w-[1064px] mx-auto mt-[25px] bg-gray-100 px-[25px] py-[15px]  rounded-lg">
					<SettingsForm />
				</div>
				<h3 className="font-bold text-mainPurple mx-auto text-[24px] text-center mt-[30px]">
					Секретари
				</h3>
				<div className="w-[1064px] mx-auto mt-[25px] bg-gray-100 px-[25px] py-[15px]  rounded-lg">
					<SecretariesForm />
				</div>
				<div className="w-[1064px] mx-auto mt-[25px] bg-gray-100 px-[25px] py-[15px]  rounded-lg">
					<div className="flex space-x-3 font-bold items-center justify-between">
						<div className=" flex items-center space-x-3 ">
							<label
								className="text-statusSalate text-[17px]"
								htmlFor="subject"
							>
								ФИО:
							</label>
							<input
								className="w-[282px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
								id="subject"
								type="text"
								value={"Сергей Иванов Иванович"}
							/>
						</div>

						<div className="flex space-x-4">
							<button className="rounded-[12px] px-[20px] py-2 bg-statusRed text-white text-xl">
								Заморозить
							</button>
							<button className="rounded-[12px] px-[20px] py-2 bg-mainPurple text-white text-xl">
								Скрыть
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserSettings;
