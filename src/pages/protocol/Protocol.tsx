import React from "react";
import ParticipantList from "../../components/participantList/ParticipantList";
import VideoProtocol from "../../components/videoProtocol/VideoProtocol";
import ProtocolAddForm from "../../components/protocolAddForm/ProtocolAddForm";
import Subtitle from "../../components/subtitle/Subtitle";
import Backward from "@assets/icons/backward.svg";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";

const Protocol = () => {
	return (
		<div className="mt-[35px] mr-5">
			<div className="font-bold text-mainPurple text-[24px] max-w-[1245px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-center relative px-[30px]">
				<div className="absolute left-0 ml-[30px] cursor-pointer">
					<Backward />
				</div>
				<h1 className="text-center w-full">Добавление протокола</h1>
				<div className="absolute right-0 mr-[100px] flex gap-4">
					<button className="flex text-[14px] items-center justify-center bg-mainPurple text-white px-4 py-1 rounded-lg">
						PDF
					</button>
					<button className="flex text-[14px]  items-center justify-center bg-mainPurple text-white px-4 py-2 rounded-lg">
						DOCX
					</button>
				</div>
			</div>
			<div className="grid grid-cols-2 grid-rows-1 mt-6 gap-4">
				<div className=" h-[653px] bg-gray-100 py-5 px-3  rounded-xl">
					<div className="relative flex items-center justify-center bg-[#EAE8F1] p-2 rounded-lg mb-3">
						<h2 className="font-bold text-[20px] text-mainPurple text-center">
							Участники
						</h2>
						<div className="absolute right-0 mr-[25px] flex gap-4 cursor-pointer">
							<AddProtocolIcon />
						</div>
					</div>

					<ParticipantList />
					<h2 className="font-bold text-[20px] text-mainPurple text-center mt-[50px]">
						Видеозапись
					</h2>
					<VideoProtocol />
				</div>
				<div className="flex justify-center w-full h-[653px] bg-gray-100 py-5 rounded-xl">
					<ProtocolAddForm />
				</div>
				<Subtitle />
			</div>
			<div className="mx-auto w-[250px] cursor-pointer text-center my-6 text-white font-bold  text-[24px} bg-mainPurple py-3 px-2 rounded-lg">
				Исполнить протокол
			</div>
		</div>
	);
};

export default Protocol;
