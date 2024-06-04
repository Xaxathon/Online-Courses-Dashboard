import React from "react";
import Participant from "@assets/img/participant.jpg";

const ParticipantItem = () => {
	return (
		<li className="w-[134px] bg-[#EAE8F1] p-2 rounded-lg flex-shrink-0">
			<img
				src={Participant}
				alt="participant"
				className="rounded-lg w-[120px] h-[92px]"
			/>
			<div className="mt-1 text-center text-mainPurple text-[12px] leading-normal font-normal whitespace-normal">
				Иванов Иван Иванович
			</div>
		</li>
	);
};

export default ParticipantItem;
