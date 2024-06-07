import React from "react";
import Modal from "../modal/Modal";

const SecretaryAddFormModal = () => {
	return (
		<Modal>
			<div className="mt-10 text-[20px] font-bold text-mainPurple">
				<h2 className="text-center">Добавление секретаря</h2>
				<form className="flex flex-col space-y-4 mt-5">
					<div className="flex flex-col space-y-[5px]">
						<label className="" htmlFor="FIO">
							ФИО
						</label>
						<input
							className="w-[600px] h-[46px] text-mainPurple text-[15px] bg-[#DFDDE5] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="FIO"
							type="text"
						/>
					</div>
					<div className="flex flex-col space-y-[5px]">
						<label className="" htmlFor="info">
							Информация об отделе
						</label>
						<input
							className="w-[600px] h-[46px] text-mainPurple text-[15px] bg-[#DFDDE5] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="info"
							type="text"
						/>
					</div>
					<div className="flex flex-col space-y-[5px]">
						<label className="" htmlFor="email">
							E-mail:
						</label>
						<input
							className="w-[600px] h-[46px] text-mainPurple text-[15px] bg-[#DFDDE5] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="email"
							type="text"
						/>
					</div>
					<div className="flex flex-col space-y-[5px]">
						<label className="" htmlFor="login">
							Логин
						</label>
						<input
							className="w-[600px] h-[46px] text-mainPurple text-[15px] bg-[#DFDDE5] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="login"
							type="text"
						/>
					</div>
					<div className="flex flex-col space-y-[5px]">
						<label className="" htmlFor="password">
							Пароль
						</label>
						<input
							className="w-[600px] h-[46px] text-mainPurple text-[15px] bg-[#DFDDE5] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="password"
							type="text"
						/>
					</div>

					<button className="px-5 py-2 mx-auto text-white bg-mainPurple rounded-lg">
						Добавить
					</button>
				</form>
			</div>
		</Modal>
	);
};

export default SecretaryAddFormModal;
