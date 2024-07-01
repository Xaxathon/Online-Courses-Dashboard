import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { useFetchUsersQuery } from "../../api/authApi";
import UserSettingForm from "../userSettingForm/UserSettingForm";
import { InternalUser, UserRole } from "../../shared/interfaces/user";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

const UsersSettingListForm = () => {
	const { data, isLoading, isError, refetch } = useFetchUsersQuery();
	const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Manager);

	const role = useSelector((state: RootState) => state.auth.role);

	const handleRoleClick = (role: UserRole) => {
		setSelectedRole(role);
	};

	const handleRefetch = () => {
		refetch();
	};
	if (isLoading)
		return (
			<div className="flex justify-center items-center mt-20">
				<Spinner />
			</div>
		);
	if (isError)
		return (
			<div>
				<p>Ошибка при загрузке данных</p>
				<button
					onClick={handleRefetch}
					className="bg-red-500 text-white p-2 rounded-lg"
				>
					Обновить
				</button>
			</div>
		);

	const users = data?.data.data as InternalUser[];
	console.log(users);
	if (!Array.isArray(users)) {
		return <p>No users available</p>;
	}

	const filteredUsers =
		role === UserRole.Admin
			? users.filter((user) => user.role === selectedRole)
			: users;
	return (
		<div className="max-w-[66rem] mx-auto">
			{role === UserRole.Admin && (
				<ul className="flex justify-center items-center gap-3 mt-7">
					<li
						className={classNames(
							"lg:p-3 p-2 w-1/2 rounded-lg font-bold lg:text-xl text-base text-center cursor-pointer",
							{
								"bg-mainPurple text-white": selectedRole === "manager",
								"bg-gray-500 text-gray-300  hover:bg-gray-400 hover:text-gray-200 active:bg-gray-300 active:text-white":
									selectedRole !== "manager",
							}
						)}
						onClick={() => handleRoleClick(UserRole.Manager)}
					>
						Менеджеры
					</li>
					<li
						className={classNames(
							"lg:p-3 p-2 w-1/2 rounded-lg font-bold lg:text-xl text-base  text-center cursor-pointer",
							{
								"bg-mainPurple text-white": selectedRole === "secretary",
								"bg-gray-500 text-gray-300 hover:bg-gray-400 hover:text-gray-200 active:bg-gray-300 active:text-white":
									selectedRole !== "secretary",
							}
						)}
						onClick={() => handleRoleClick(UserRole.Secretary)}
					>
						Секретари
					</li>
				</ul>
			)}

			{filteredUsers.map((user) => (
				<UserSettingForm key={user.id} user={user} />
			))}
		</div>
	);
};

export default UsersSettingListForm;
