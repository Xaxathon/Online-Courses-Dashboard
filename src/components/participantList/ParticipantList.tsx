import React from "react";
import ParticipantItem from "../participantItem/ParticipantItem";

const ParticipantList = () => {
	return (
		<ul className="w-full flex space-x-4 overflow-x-auto">
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
		</ul>
	);
};

export default ParticipantList;
