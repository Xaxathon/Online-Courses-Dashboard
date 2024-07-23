import { useState } from "react";

import { useParams } from "react-router-dom";

import { ReactComponent as AddProtocolIcon } from "@assets/icons/add-icon.svg";

import ProtocolParticipantItem from "../protocolParticipantItem/ProtocolParticipantItem";
import DeleteElementModal from "../deleteElementModal/DeleteElementModal";
import ExternalUserAddModal from "../externalUserAddModal/ExternalUserAddModal";

import {
	useGetProtocolMembersQuery,
	useAddProtocolMemberMutation,
	useDeleteProtocolMemberMutation,
} from "@/api/protocolsApi";

import { ProtocolMember } from "@/shared/interfaces/protocol";
import { ExternalUser, InternalUser } from "@/shared/interfaces/user";

const ProtocolParticipantList = () => {
	const { id: protocolIdStr } = useParams<{ id: string }>();

	const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

	const protocolId = protocolIdStr ? Number(protocolIdStr) : undefined;
	// Добавил условие для проверки (сужение типов)
	if (protocolId === undefined || isNaN(protocolId)) {
		throw new Error("Invalid protocol ID");
	}

	const { data: usersResponse, refetch } =
		useGetProtocolMembersQuery(protocolId);

	const [addMember, { isError: isAddingError }] =
		useAddProtocolMemberMutation();
	const [
		deleteMember,
		{ isError: isDeletingError, isLoading: isDeleteLoading },
	] = useDeleteProtocolMemberMutation();

	const [selectedUser, setSelectedUser] = useState<{
		id: number;
		member: { full_name: string };
	} | null>(null);

	const handleUserSelect = async (user: InternalUser | ExternalUser) => {
		if (user.id !== undefined) {
			try {
				await addMember({
					protocolId: protocolId,
					memberId: user.id,
				}).unwrap();
				refetch();
			} catch (error) {
				console.error("Failed to add member:", error);
			}
		} else {
			console.error("Failed to add member: user id is undefined");
		}
	};

	const handleDeleteUser = async () => {
		if (selectedUser) {
			try {
				await deleteMember({
					memberId: selectedUser.id,
				}).unwrap();
				refetch();
				handleCloseDeleteModal();
			} catch (error) {
				console.error("Failed to delete member:", error);
			}
		} else {
			console.error("Failed to add member: user id is undefined");
		}
	};

	const handleOpenDeleteModal = (user: {
		id: number;
		member: { full_name: string };
	}) => {
		setSelectedUser(user);
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedUser(null);
	};

	return (
		<>
			<div className="relative flex items-center justify-center p-2 bg-lightPurple rounded-lg">
				<h2 className="font-bold lg:text-xl text-base text-mainPurple text-center">
					Участники
				</h2>
				<AddProtocolIcon
					className="absolute right-0 mr-6 w-8 h-8 cursor-pointer"
					onClick={() => setIsAddUserModalOpen(true)}
				/>
			</div>

			<ul className="flex gap-4 overflow-x-auto mt-4">
				{usersResponse?.map((user: ProtocolMember) => (
					<ProtocolParticipantItem
						key={user.id}
						user={user}
						onDelete={handleOpenDeleteModal}
					/>
				))}
			</ul>

			{isAddingError && (
				<div className="mt-2 p-2 bg-red-100 border border-red-400 text-crimsonRed rounded-lg">
					Не удалось добавить участника, либо он уже в списке
				</div>
			)}
			{isDeletingError && (
				<div className="mt-2 p-2 bg-red-100 border border-red-400 text-crimsonRed rounded-lg">
					Не удалось удалить участника
				</div>
			)}

			{isAddUserModalOpen && (
				<ExternalUserAddModal
					onClose={() => setIsAddUserModalOpen(false)}
					onUserSelect={handleUserSelect}
				/>
			)}
			{isDeleteModalOpen && selectedUser && (
				<DeleteElementModal
					onClose={handleCloseDeleteModal}
					onDelete={handleDeleteUser}
					title="Удаление участника"
					description={selectedUser.member.full_name}
					isLoading={isDeleteLoading}
				/>
			)}
		</>
	);
};

export default ProtocolParticipantList;
