import React from "react";
import Participant from "@assets/img/participant.jpg";

const UserForm = () => {
	return (
		<form action="w-full">
			<div className="flex space-x-3 font-bold items-center ">
				<label className="text-statusSalate text-[17px]" htmlFor="fio">
					ФИО:
				</label>
				<input
					className="w-[282px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
					id="fio"
					type="text"
				/>
			</div>
			<div className="flex mt-[30px] justify-between w-full">
				<div className="h-[190px] max-w-[190px] mr-3 bg-[#EAE8F1] flex flex-col items-center  justify-center rounded-lg">
					<img
						src={Participant}
						alt="/"
						className="w-[141px] h-[141px] rounded-lg object-cover"
					/>
					<span className=" w-[112px] text-[13px] font-normal leading-none text-mainPurple mt-1 text-center">
						Нажмите, чтобы изменить фото
					</span>
				</div>
				<div className="grid grid-cols-2 grid-rows-2 gap-5 gap-x-2 font-bold justify-around w-full">
					<div className="flex flex-col space-y-[5px]">
						<label className="text-statusSalate text-[17px]" htmlFor="name">
							Наименование отдела
						</label>
						<input
							className="max-w-[398px] h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="name"
							type="text"
						/>
					</div>
					<div className="flex flex-col space-y-[5px] w-full">
						<label className="text-statusSalate text-[17px]" htmlFor="login">
							Логин
						</label>
						<input
							className="max-w-[398px] h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="login"
							type="text"
						/>
					</div>
					<div className="flex flex-col space-y-[5px] w-full">
						<label className="text-statusSalate text-[17px]" htmlFor="email">
							E-mail
						</label>
						<input
							className="max-w-[398px] h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="email"
							type="text"
						/>
					</div>
					<div className="flex flex-col space-y-[5px] w-full">
						<label className="text-statusSalate text-[17px]" htmlFor="password">
							Пароль
						</label>
						<input
							className="max-w-[398px] h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="password"
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

export default UserForm;
