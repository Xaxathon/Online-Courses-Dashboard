import React from "react";
import Backward from "@assets/icons/backward.svg";
import ProtocolAddForm from "../../components/protocolAddForm/ProtocolAddForm";
import FileUpload from "../../components/fileUpload/FileUpload";
import Calendar from "../../components/calendar/Calendar";

const AddProtocol = () => {
	return (
		<div className=" w-full mx-5 mt-7 ">
			<div className="font-bold text-mainPurple text-2xl py-3 px-7 rounded-xl bg-gray-100 flex items-center justify-start mb-8">
				<Backward className="w-9 h-9 cursor-pointer" />

				<h1 className="mx-auto text-center">Добавление протокола</h1>
			</div>

			<div className=" grid grid-cols-2 justify-around gap-5">
				<ProtocolAddForm />
				<div className="font-bold text-lg text-mainPurple text-center">
					<h2 className=" mb-2">Выбрать дату</h2>
					<Calendar />

					<FileUpload />
				</div>
			</div>
		</div>
	);
};

export default AddProtocol;
