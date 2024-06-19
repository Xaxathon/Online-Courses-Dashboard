import ParticipantItem from "../participantItem/ParticipantItem";

const ParticipantList = () => {
	return (
		<ul className="flex gap-4 overflow-x-auto">
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
			<ParticipantItem />
		</ul>
	);
};

export default ParticipantList;
