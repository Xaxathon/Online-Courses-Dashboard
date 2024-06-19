import React, { useState } from "react";
import Participant from "@assets/img/participant.jpg";
const SecretaryForm = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	return (
		<form
			action=""
			className="max-w-[1064px] mx-auto mt-[25px] bg-gray-100 px-[25px] py-[15px]  rounded-lg"
		>
			<div className="flex space-x-3 font-bold items-center justify-between">
				<div className=" flex items-center space-x-3 ">
					<label className="text-statusSalate text-[17px]" htmlFor="fio">
						ФИО:
					</label>
					<input
						className="w-[282px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
						id="fio"
						type="text"
					/>
				</div>

				<div className="flex space-x-4">
					<button
						type="button"
						className="rounded-[12px] px-[20px] py-2 bg-statusRed text-white text-xl "
					>
						Заморозить
					</button>
					<button
						className="rounded-[12px] px-[20px] py-2 bg-mainPurple text-white text-xl"
						onClick={toggleExpand}
						type="button"
					>
						{isExpanded ? "Скрыть" : "Показать"}
					</button>
				</div>
			</div>
			{isExpanded && (
				<div>
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
						<div className="grid grid-cols-2 grid-rows-2 gap-5 font-bold justify-around w-full">
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
								<label
									className="text-statusSalate text-[17px]"
									htmlFor="login"
								>
									Логин
								</label>
								<input
									className="max-w-[398px] h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
									id="login"
									type="text"
								/>
							</div>
							<div className="flex flex-col space-y-[5px] w-full">
								<label
									className="text-statusSalate text-[17px]"
									htmlFor="email"
								>
									E-mail
								</label>
								<input
									className="max-w-[398px] h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
									id="email"
									type="text"
								/>
							</div>
							<div className="flex flex-col space-y-[5px] w-full">
								<label
									className="text-statusSalate text-[17px]"
									htmlFor="password"
								>
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
				</div>
			)}
		</form>
	);
};

export default SecretaryForm;
