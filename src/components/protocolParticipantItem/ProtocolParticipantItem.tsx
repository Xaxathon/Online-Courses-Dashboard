import { ProtocolMember } from "@/shared/interfaces/protocol";

interface ProtocolParticipantItemProps {
	user: ProtocolMember;
	onDelete: (user: ProtocolMember) => void;
}

const ProtocolParticipantItem = ({
	user,
	onDelete,
}: ProtocolParticipantItemProps) => {
	return (
		<li
			className="text-xs flex-shrink-0 p-3 bg-lightPurple text-mainPurple rounded-lg whitespace-nowrap cursor-pointer hover:bg-lightPurpleHover"
			onClick={() => onDelete(user)}
		>
			{user.member.full_name}
		</li>
	);
};

export default ProtocolParticipantItem;
