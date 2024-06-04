import React from "react";
import Backward from "@assets/icons/backward.svg";
import ProtocolAddForm from "../../components/protocolAddForm/ProtocolAddForm";
import FileUpload from "../../components/fileUpload/FileUpload";
import Calendar from "../../components/calendar/Calendar";

const AddProtocol = () => {
	return (
		<div className="mx-auto">
			<div className=" mr-[15px] mt-[35px] space-y-[30px]">
				<div className="font-bold text-mainPurple text-[24px] w-[1245px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-center relative px-[30px]">
					<div className="absolute left-0 ml-[30px] cursor-pointer">
						<Backward />
					</div>
					<h1 className="text-center">Добавление протокола</h1>
				</div>

				<div className="max-w-[1245px] justify-center gap-[100px] grid grid-cols-[minmax(406px,_532px)_minmax(427px,_475px)] ">
					<ProtocolAddForm />
					<div className="font-bold text-lg text-mainPurple text-center">
						<h2 className=" mb-2">Выбрать дату</h2>
						<Calendar />
						<div className="mt-[55px]">
							<FileUpload />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProtocol;
