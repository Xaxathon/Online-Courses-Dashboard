import React from "react";
import Modal from "../modal/Modal";

const SecretaryAddFormModal = ({ onClose }) => {
	return (
		<Modal onClose={onClose}>
			<form className="w-[40rem] flex flex-col gap-4 mt-10 text-xl font-bold text-mainPurple ">
				<span className="text-center">Добавление секретаря</span>
				<div className="flex flex-col gap-1">
					<label className="" htmlFor="FIO">
						ФИО
					</label>
					<input
						className="text-mainPurple text-base bg-inputPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
						id="FIO"
						type="text"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="" htmlFor="info">
						Информация об отделе
					</label>
					<input
						className="text-mainPurple text-base bg-inputPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
						id="info"
						type="text"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="" htmlFor="email">
						E-mail
					</label>
					<input
						className="text-mainPurple text-base bg-inputPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
						id="email"
						type="text"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="" htmlFor="login">
						Логин
					</label>
					<input
						className="text-mainPurple text-base bg-inputPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
						id="login"
						type="text"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="" htmlFor="password">
						Пароль
					</label>
					<input
						className="text-mainPurple text-base bg-inputPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
						id="password"
						type="password"
					/>
				</div>

				<button className="px-5 py-2 mx-auto text-white bg-mainPurple rounded-lg">
					Добавить
				</button>
			</form>
		</Modal>
	);
};

export default SecretaryAddFormModal;
