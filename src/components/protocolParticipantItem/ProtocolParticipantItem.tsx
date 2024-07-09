import React from "react";

import { ProtocolMember } from "@/shared/interfaces/protocol";

interface ProtocolParticipantItemProps {
	user: ProtocolMember;
	onDelete: (user: ProtocolMember) => void;
}

const ProtocolParticipantItem: React.FC<ProtocolParticipantItemProps> = ({
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

export default ProtocolParticipantItem;
