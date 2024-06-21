import React from "react";
import ParticipantList from "../../components/participantList/ParticipantList";
import VideoProtocol from "../../components/videoProtocol/VideoProtocol";
import ProtocolAddForm from "../../components/protocolAddForm/ProtocolAddForm";
import Subtitle from "../../components/subtitle/Subtitle";
import Backward from "@assets/icons/backward.svg";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";

const Protocol = () => {
	return (
		<div className="flex flex-col items-center mt-8 mr-5 w-full">
			<div className="min-w-full flex items-center justify-between py-2 px-7 font-bold text-mainPurple  rounded-xl bg-gray-100">
				<Backward className="w-9 h-9 cursor-pointer" />
				<h1 className="lg:text-2xl text-xl">Добавление протокола</h1>
				<div className="flex gap-4">
					<button className="text-base bg-mainPurple text-white px-4 py-1 rounded-lg">
						PDF
					</button>
					<button className="text-base bg-mainPurple text-white px-4 py-2 rounded-lg">
						DOCX
					</button>
				</div>
			</div>
			<div className="grid grid-cols-2 grid-rows-1 mt-6 gap-4">
				<div className=" bg-gray-100 py-5 px-3  rounded-xl">
					<div className="relative flex items-center justify-center p-2 bg-inputPurple rounded-lg">
						<h2 className="font-bold lg:text-xl text-base text-mainPurple text-center">
							Участники
						</h2>
						<AddProtocolIcon className="absolute right-0 mr-6 w-8 h-8 cursor-pointer" />
					</div>
					<div className="mt-4">
						<ParticipantList />
					</div>

					<h2 className="font-bold text-xl text-mainPurple text-center mt-8">
						Видеозапись
					</h2>
					<VideoProtocol />
				</div>
				<div className="flex justify-center w-full bg-gray-100 py-5 xl:px-10 px-5 lg:px-7 rounded-xl">
					<ProtocolAddForm />
				</div>
				<Subtitle />
			</div>
			<button className="my-6 text-white font-bold text-xl bg-mainPurple py-3 px-2 rounded-lg">
				Исполнить протокол
			</button>
		</div>
	);
};

export default Protocol;
