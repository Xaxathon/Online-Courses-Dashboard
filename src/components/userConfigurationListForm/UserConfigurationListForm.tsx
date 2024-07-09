import { useCallback, useState, useEffect, useRef } from "react";

import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

import classNames from "classnames";
import UserConfigurationForm from "../userConfigurationForm/UserConfigurationForm";
import Skeleton from "../skeleton/Skeleton";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useFetchUsersQuery } from "@/api/authApi";

import { InternalUser, UserRole } from "@/shared/interfaces/user";

const DEFAULT_LIMIT = 10;
const MIN_USERS_TO_SHOW_MESSAGE = 10;

interface UserConfigurationListFormProps {
	shouldRefetch: boolean;
	onRefetchComplete: () => void;
}

const UserConfigurationListForm = ({
	shouldRefetch,
	onRefetchComplete,
}: UserConfigurationListFormProps) => {
	const [page, setPage] = useState(1);
	const [allUsers, setAllUsers] = useState<InternalUser[]>([]);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

	const role = useSelector((state: RootState) => state.auth.role);

	const { data, isLoading, isError, isFetching, refetch } = useFetchUsersQuery({
		limit: DEFAULT_LIMIT,
		page: page,
		with_blocked: "1",
	});

	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (shouldRefetch) {
			setPage(1);
			setAllUsers([]);
			refetch().then(() => {
				onRefetchComplete();
			});
		}
	}, [shouldRefetch, refetch, onRefetchComplete]);

	const lastUserElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					!isFetching &&
					data?.data?.data &&
					Array.isArray(data.data.data) &&
					data.data.data.length === DEFAULT_LIMIT
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, data]
	);

	useEffect(() => {
		if (data?.data?.data) {
			setAllUsers((prevUsers) => {
				const newUsers = Array.isArray(data.data.data)
					? data.data.data
					: [data.data.data];
				if (page === 1) {
					return newUsers;
				} else {
					const uniqueNewUsers = newUsers.filter(
						(newUser) =>
							!prevUsers.some((prevUser) => prevUser.id === newUser.id)
					);
					return [...prevUsers, ...uniqueNewUsers];
				}
			});
		}
	}, [data, page]);

	useEffect(() => {
		if (!isLoading && !isFetching) {
			setInitialLoadComplete(true);
		}
	}, [isLoading, isFetching]);

	const handleRefetch = () => {
		refetch();
	};

	const handleRoleClick = (role: UserRole) => {
		setSelectedRole(role === selectedRole ? null : role);
	};

	const filteredUsers = selectedRole
		? allUsers.filter((user) => user.role === selectedRole)
		: allUsers;

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

	const showNoMoreUsersMessage =
		!isFetching &&
		initialLoadComplete &&
		filteredUsers.length >= MIN_USERS_TO_SHOW_MESSAGE &&
		data?.data?.data &&
		Array.isArray(data.data.data) &&
		data.data.data.length < DEFAULT_LIMIT;

	return (
		<div className="max-w-[66rem] mx-auto">
			{role === UserRole.Admin && (
				<ul className="flex justify-center items-center gap-3 mt-7">
					<li
						className={classNames(
							"lg:p-3 p-2 w-1/2 rounded-lg font-bold lg:text-xl text-base text-center cursor-pointer",
							{
								"bg-mainPurple text-white": selectedRole === UserRole.Manager,
								"bg-gray-500 text-gray-300  hover:bg-gray-400 hover:text-gray-200 active:bg-gray-300 active:text-white":
									selectedRole !== UserRole.Manager,
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
								"bg-mainPurple text-white": selectedRole === UserRole.Secretary,
								"bg-gray-500 text-gray-300 hover:bg-gray-400 hover:text-gray-200 active:bg-gray-300 active:text-white":
									selectedRole !== UserRole.Secretary,
							}
						)}
						onClick={() => handleRoleClick(UserRole.Secretary)}
					>
						Секретари
					</li>
				</ul>
			)}
			{isLoading && allUsers.length === 0 && (
				<div className="max-w-[66rem] mx-auto mt-6 bg-gray-100 px-6 py-4 rounded-lg">
					<Skeleton width="1/2" height="10" className="rounded-lg mb-6" />
					<Skeleton width="3/4" height="44" className=" rounded-lg mb-4" />
					<Skeleton
						width="1/2"
						height="10"
						className=" mx-auto rounded-lg mb-4"
					/>
				</div>
			)}
			{filteredUsers.map((user, index) => (
				<UserConfigurationForm
					key={user.id}
					user={user}
					ref={index === allUsers.length - 1 ? lastUserElementRef : null}
				/>
			))}

			{isFetching && (
				<div className="flex justify-center items-center mt-4">
					<Spinner className="w-6 h-6 animate-spin" />
				</div>
			)}

			{showNoMoreUsersMessage && (
				<div className="text-center mt-4 text-mainPurple">
					Больше нет пользователей для загрузки
				</div>
			)}
		</div>
	);
};

export default UserConfigurationListForm;
