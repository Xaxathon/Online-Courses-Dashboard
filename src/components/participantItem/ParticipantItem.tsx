import React from "react";

import { ProtocolMember } from "../../shared/interfaces/protocol";

interface ParticipantItemProps {
	user: ProtocolMember;
	onDelete: (user: ProtocolMember) => void;
}

// Компонент ParticipantItem
const ParticipantItem: React.FC<ParticipantItemProps> = ({
	user,
	onDelete,
}) => {
	return (
		<li
			className="text-xs flex-shrink-0 p-3 bg-lightPurple text-mainPurple rounded-lg whitespace-nowrap cursor-pointer"
			onClick={() => onDelete(user)}
		>
			{user.member.full_name}
		</li>
	);
};

export default ParticipantItem;
