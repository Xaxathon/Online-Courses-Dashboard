import { useCallback, useState, useEffect, useRef } from "react";

import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

import UserConfigurationForm from "../userConfigurationForm/UserConfigurationForm";
import Skeleton from "../skeleton/Skeleton";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useFetchUsersQuery } from "@/api/authApi";

import { InternalUser, UserRole } from "@/shared/interfaces/user";

const DEFAULT_LIMIT = 10;

const UserConfigurationListForm = () => {
	const [page, setPage] = useState(1);
	const [allUsers, setAllUsers] = useState<InternalUser[]>([]);

	const role = useSelector((state: RootState) => state.auth.role);

	const { data, isLoading, isError, isFetching, refetch } = useFetchUsersQuery({
		limit: DEFAULT_LIMIT,
		page: page,
		with_blocked: "1",
	});

	const observer = useRef<IntersectionObserver | null>(null);

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
	}, [data]);

	const lastUserElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				const hasMoreData =
					data?.data?.data &&
					Array.isArray(data.data.data) &&
					data.data.data.length === DEFAULT_LIMIT;

				if (entries[0].isIntersecting && !isFetching && hasMoreData) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, data]
	);

	return (
		<div className="max-w-[66rem] mx-auto">
			{role === UserRole.Admin && (
				<div className="flex justify-center items-center gap-3 mt-7 text-2xl font-bold text-mainPurple">
					Пользователи
				</div>
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
			{allUsers.map((user, index) => (
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
			{isError && (
				<div className="flex flex-col justify-center items-center mt-10 gap-4">
					<p className="text-center text-crimsonRed font-bold">
						Ошибка при загрузке данных
					</p>
					<button
						onClick={() => refetch()}
						className=" bg-crimsonRed text-white px-10 text-base py-2 rounded-lg"
					>
						Обновить
					</button>
				</div>
			)}
		</div>
	);
};

export default UserConfigurationListForm;
