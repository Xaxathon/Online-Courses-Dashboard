import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { useFetchUsersQuery } from "../../api/authApi";
import UserSettingForm from "../userSettingForm/UserSettingForm";
import { InternalUser, UserRole } from "../../shared/interfaces/user";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const UsersSettingListForm = () => {
	const { data, isLoading, isError } = useFetchUsersQuery();
	const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Manager);

	const role = useSelector((state: RootState) => state.auth.role);

	const handleRoleClick = (role: UserRole) => {
		setSelectedRole(role);
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error loading users</p>;

	const users = data?.data.data;

	if (!Array.isArray(users)) {
		return <p>No users available</p>;
	}

	const filteredUsers: InternalUser[] = users.filter(
		(user): user is InternalUser => !user.external && user.role === selectedRole
	);
	return (
		<div className="max-w-[66rem] mx-auto">
			{role === UserRole.Admin && (
				<ul className="flex justify-center items-center gap-3 mt-7">
					<li
						className={classNames(
							"lg:p-3 p-2 w-1/2 rounded-lg font-bold lg:text-xl text-base text-center",
							{
								"bg-mainPurple text-white": selectedRole === "manager",
								"bg-gray-500 text-gray-300": selectedRole !== "manager",
							}
						)}
						onClick={() => handleRoleClick(UserRole.Manager)}
					>
						Менеджеры
					</li>
					<li
						className={classNames(
							"lg:p-3 p-2 w-1/2 rounded-lg font-bold lg:text-xl text-base  text-center",
							{
								"bg-mainPurple text-white": selectedRole === "secretary",
								"bg-gray-500 text-gray-300": selectedRole !== "secretary",
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
