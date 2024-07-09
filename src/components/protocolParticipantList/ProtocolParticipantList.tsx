import { useState, useEffect } from "react";

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
	const protocolId = protocolIdStr ? Number(protocolIdStr) : undefined;

	if (protocolId === undefined || isNaN(protocolId)) {
		throw new Error("Invalid protocol ID");
	}
	const {
		data: usersResponse,
		error,
		refetch,
	} = useGetProtocolMembersQuery(protocolId);

	const [addMember] = useAddProtocolMemberMutation();
	const [deleteMember] = useDeleteProtocolMemberMutation();
	const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<{
		id: number;
		member: { full_name: string };
	} | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		if (error) {
			console.error("Failed to fetch users:", error);
			if (
				"data" in error &&
				typeof error.data === "object" &&
				error.data &&
				"message" in error.data
			) {
				setErrorMessage(error.data.message as string);
			} else {
				setErrorMessage("Произошла ошибка при загрузке участников");
			}
		} else {
			setErrorMessage(null);
		}
	}, [error]);

	const handleOpenAddUserModal = () => {
		setIsAddUserModalOpen(true);
	};

	const handleCloseAddUserModal = () => {
		setIsAddUserModalOpen(false);
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

	const handleUserSelect = async (user: InternalUser | ExternalUser) => {
		if (user.id !== undefined) {
			try {
				await addMember({
					protocolId: protocolId,
					memberId: user.id,
				}).unwrap();
				refetch();
				setErrorMessage(null);
			} catch (error) {
				console.error("Failed to add member:", error);
				if (
					error &&
					typeof error === "object" &&
					"data" in error &&
					typeof error.data === "object" &&
					error.data &&
					"message" in error.data
				) {
					setErrorMessage(error.data.message as string);
				} else {
					setErrorMessage("Не удалось добавить участника");
				}
			} finally {
				handleCloseAddUserModal();
			}
		} else {
			console.error("Failed to add member: user id is undefined");
			setErrorMessage(
				"Не удалось добавить участника: ID пользователя не определен"
			);
		}
	};

	const handleDeleteUser = async () => {
		if (selectedUser) {
			try {
				await deleteMember({
					memberId: selectedUser.id,
				}).unwrap();
				refetch();
				setErrorMessage(null);
			} catch (error) {
				console.error("Failed to delete member:", error);
				if (
					error &&
					typeof error === "object" &&
					"data" in error &&
					typeof error.data === "object" &&
					error.data &&
					"message" in error.data
				) {
					setErrorMessage(error.data.message as string);
				} else {
					setErrorMessage("Не удалось удалить участника");
				}
			} finally {
				handleCloseDeleteModal();
			}
		}
	};
	return (
		<>
			<div className="relative flex items-center justify-center p-2 bg-lightPurple rounded-lg">
				<h2 className="font-bold lg:text-xl text-base text-mainPurple text-center">
					Участники
				</h2>
				<AddProtocolIcon
					className="absolute right-0 mr-6 w-8 h-8 cursor-pointer"
					onClick={handleOpenAddUserModal}
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
			{errorMessage && (
				<div className="mt-2 p-2 bg-red-100 border border-red-400 text-crimsonRed rounded-lg">
					{errorMessage}
				</div>
			)}
			{isAddUserModalOpen && (
				<ExternalUserAddModal
					onClose={handleCloseAddUserModal}
					onUserSelect={handleUserSelect}
				/>
			)}
			{isDeleteModalOpen && selectedUser && (
				<DeleteElementModal
					onClose={handleCloseDeleteModal}
					onDelete={handleDeleteUser}
					title="Удаление участника"
					description={selectedUser.member.full_name}
				/>
			)}
		</>
	);
};

export default ProtocolParticipantList;
