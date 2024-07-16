import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ReactComponent as Backward } from "@assets/icons/backward.svg";
import { ReactComponent as AddUserIcon } from "@assets/icons/add-icon.svg";

import UserConfigurationListForm from "@components/userConfigurationListForm/UserConfigurationListForm";
import UserSettingPersonalForm from "@components/userSettingPersonalForm/UserSettingPersonalForm";
import UserAddFormModal from "@components/userAddFormModal/UserAddFormModal";
import Skeleton from "@components/skeleton/Skeleton";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLazyFetchPersonalUserQuery } from "@/api/authApi";

import { UserRole } from "@/shared/interfaces/user";

const UserSetting = () => {
	const navigate = useNavigate();

	const role = useSelector((state: RootState) => state.auth.role);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [fetchUser, { data: userData, isLoading, isError }] =
		useLazyFetchPersonalUserQuery();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return (
		<div className="mt-7 w-full mr-4 mb-20">
			<div className="flex items-center justify-between font-bold text-mainPurple xl:text-2xl text-xl rounded-xl bg-gray-100 py-2 px-7">
				<Backward
					className="w-9 h-9 cursor-pointer fill-current text-mainPurple hover:text-mainPurpleHover active:text-mainPurpleActive"
					onClick={() => navigate(-1)}
				/>
				<h1 className="text-center w-full">Данные о пользователях</h1>
				{role && [UserRole.Admin, UserRole.Manager].includes(role) && (
					<AddUserIcon
						className="w-10 h-10 cursor-pointer"
						onClick={() => setIsModalOpen(true)}
					/>
				)}
			</div>
			<div className="mt-6">
				<h2 className="font-bold text-mainPurple mx-auto text-2xl text-center">
					Мой профиль
				</h2>
				<div className="max-w-[66rem] mx-auto mt-6 bg-gray-100 px-6 py-4 rounded-lg">
					{isLoading && (
						<>
							<Skeleton width="1/2" height="10" className="rounded-lg mb-6" />
							<Skeleton width="3/4" height="44" className=" rounded-lg mb-4" />
							<Skeleton
								width="1/2"
								height="10"
								className=" mx-auto rounded-lg mb-4"
							/>
						</>
					)}
					{isError && <p>Error loading user data</p>}
					{userData && <UserSettingPersonalForm userData={userData.data} />}
				</div>
				{role === UserRole.Manager && (
					<h3 className="font-bold text-mainPurple mx-auto text-2xl text-center mt-7">
						Секретари
					</h3>
				)}
				{role !== UserRole.Secretary && <UserConfigurationListForm />}
			</div>
			{isModalOpen && role && role !== UserRole.Secretary && (
				<UserAddFormModal
					onClose={() => setIsModalOpen(false)}
					role={role}
					onUserAdded={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default UserSetting;
