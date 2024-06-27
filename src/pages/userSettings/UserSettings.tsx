import React, { useEffect, useState } from "react";
import Backward from "@assets/icons/backward.svg";
import UsersSettingListForm from "../../components/usersSettingListForm/UsersSettingListForm";
import { useNavigate } from "react-router-dom";
import { useLazyFetchUserQuery, useFetchUsersQuery } from "../../api/authApi";
import UserForm from "../../components/userForm/UserForm";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";
import UserAddFormModal from "../../components/userAddFormModal/userAddFormModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { UserRole } from "../../shared/interfaces/user";
import Skeleton from "../../components/skeleton/Skeleton";

const UserSettings = () => {
	const navigate = useNavigate();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [fetchUser, { data: userData, isLoading, isError }] =
		useLazyFetchUserQuery();
	const { refetch: refetchUsers } = useFetchUsersQuery();
	const role = useSelector((state: RootState) => state.auth.role);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const handleBack = () => {
		navigate(-1);
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		refetchUsers();
	};
	return (
		<div className="mt-7 w-full mr-4 mb-20">
			<div className="flex items-center justify-between font-bold text-mainPurple xl:text-2xl text-xl rounded-xl bg-gray-100 py-2 px-7">
				<Backward
					className="w-9 h-9 cursor-pointer fill-current text-mainPurple hover:text-mainPurpleHover active:text-mainPurpleActive"
					onClick={handleBack}
				/>
				<h1 className="text-center w-full">Данные о пользователях</h1>
				{role && [UserRole.Admin, UserRole.Manager].includes(role) && (
					<AddProtocolIcon
						className="w-10 h-10 cursor-pointer"
						onClick={handleOpenModal}
					/>
				)}
			</div>
			<div className="mt-6">
				<h2 className="font-bold text-mainPurple mx-auto text-2xl text-center">
					Мой профиль
				</h2>
				<div className="max-w-[66rem] mx-auto mt-6 bg-gray-100 px-6 py-4 rounded-lg">
					{isLoading && <Skeleton />}
					{isError && <p>Error loading user data</p>}
					{userData && <UserForm userData={userData.data} />}
				</div>
				{role === UserRole.Manager && (
					<h3 className="font-bold text-mainPurple mx-auto text-2xl text-center mt-7">
						Секретари
					</h3>
				)}
				{role !== UserRole.Secretary && <UsersSettingListForm />}
			</div>
			{isModalOpen && role && role !== UserRole.Secretary && (
				<UserAddFormModal
					onClose={handleCloseModal}
					role={role}
					refetchUsers={refetchUsers}
				/>
			)}
		</div>
	);
};

export default UserSettings;
