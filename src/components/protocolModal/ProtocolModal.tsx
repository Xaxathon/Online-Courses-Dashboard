import React, { useState } from "react";
import CloseModal from "@assets/icons/сloseModal.svg";
import Modal from "../modal/Modal";
const ProtocolModal = () => {
	return (
		<Modal>
			<div className="w-[729px]  mt-[60px] inputPurple text-[20px] font-bold text-mainPurple text-center">
				<div className="grid grid-cols-2  gap-4">
					<div>
						<h2>Задача</h2>
						<div className="h-[334px] overflow-y-auto mt-2 rounded-lg">
							<input
								className="w-[98%] h-[54px] text-[16px] my-2 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
							<input
								className="w-[98%] h-[54px] text-[16px] my-2 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
							<input
								className="w-[98%] h-[54px] text-[16px] my-2 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
							<input
								className="w-[98%] h-[54px] text-[16px] my-2 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
							<input
								className="w-[98%] h-[54px] text-[16px] my-2 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
						</div>
					</div>
					<div>
						<h2>Ответственный</h2>
						<div className="h-[334px] overflow-y-auto mt-2  rounded-lg">
							<input
								className="w-[98%] h-[54px] text-[16px] my-2 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="ПОКА НИЧЕГО НЕТ!!!"
								type="text"
							/>
						</div>
					</div>
				</div>
				<div className="flex items-end justify-between mt-7">
					<div>
						<h2>Дата</h2>
						<input
							className="w-[240px] h-[54px] text-[20px] my-2 bg-[#e7e4ef] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="ПОКА НИЧЕГО НЕТ!!!"
							type="text"
						/>
					</div>
					<div className="flex justify-end space-x-4 mb-2">
						<button className="p-1 h-[54px] rounded-lg bg-mainPurple text-white font-bold text-center">
							Добавить поле
						</button>
						<button className="p-1 px-4 h-[54px] rounded-lg bg-mainPurple text-white font-bold text-center">
							Сохранить
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ProtocolModal;
