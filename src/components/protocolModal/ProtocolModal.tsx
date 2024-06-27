import React, { useState } from "react";
import CloseModal from "@assets/icons/сloseModal.svg";
import Modal from "../modal/Modal";
const ProtocolModal = () => {
	return (
		<Modal>
			<div className="mt-14 text-xl font-bold text-mainPurple text-center">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h2>Задача</h2>
						<div className="h-[20rem] overflow-y-auto mt-2 rounded-lg">
							<input
								className="w-[98%] text-base my-2 bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
						</div>
					</div>
					<div>
						<h2>Ответственный</h2>
						<div className="h-[20rem] overflow-y-auto mt-2 rounded-lg">
							<input
								className="w-[98%] text-base my-2 bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
						</div>
					</div>
				</div>
				<div className="flex items-end justify-between mt-7">
					<div className="flex flex-col px-10">
						<label htmlFor="dateInput">Дата</label>
						<input
							className="text-xl my-2 bg-lightPurple p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="dateInput"
							type="text"
						/>
					</div>
					<div className="flex justify-end gap-4 mb-2">
						<button className="py-3 px-2 rounded-lg bg-mainPurple text-white font-bold text-center hover:bg-mainPurpleHover active:bg-mainPurpleActive">
							Добавить поле
						</button>
						<button className="py-3 px-2 rounded-lg bg-mainPurple text-white font-bold text-center hover:bg-mainPurpleHover active:bg-mainPurpleActive">
							Сохранить
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ProtocolModal;
