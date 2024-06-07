import ParticipantItem from "../participantItem/ParticipantItem";

const ParticipantList = () => {
	return (
		<ul className=" flex space-x-4 justify-start max-w-[584px] overflow-x-auto">
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
		</ul>
	);
};

export default ParticipantList;
