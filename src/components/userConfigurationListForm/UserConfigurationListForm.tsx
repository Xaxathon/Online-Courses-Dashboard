import { useCallback, useState, useEffect, useRef } from "react";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";
import { ReactComponent as Search } from "@assets/icons/search.svg";
import UserConfigurationForm from "../userConfigurationForm/UserConfigurationForm";
import Skeleton from "../skeleton/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useFetchUsersQuery } from "@/api/authApi";
import { InternalUser, UserRole } from "@/shared/interfaces/user";

const UserConfigurationListForm = () => {
	const [page, setPage] = useState(1);
	const [allUsers, setAllUsers] = useState<InternalUser[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchInput, setSearchInput] = useState("");

	const role = useSelector((state: RootState) => state.auth.role);
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { data, isLoading, isError, isFetching } = useFetchUsersQuery({
		limit: searchTerm
			? undefined
			: Number(import.meta.env.VITE_DEFAULT_PAGINATION_LIMIT) || 15,
		page: searchTerm ? undefined : page,
		search: searchTerm,
		with_blocked: "1",
	});

	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (data?.data?.data) {
			setAllUsers((prevUsers) => {
				const newUsers = Array.isArray(data.data.data)
					? data.data.data
					: [data.data.data];
				if (page === 1 || searchTerm) {
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
	}, [data, page, searchTerm]);

	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		if (searchInput !== searchTerm) {
			searchTimeoutRef.current = setTimeout(() => {
				setSearchTerm(searchInput);
				setPage(1);
			}, Number(import.meta.env.VITE_SEARCH_DELAY) || 1000);
		}

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchInput]);

	const lastUserElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				const hasMoreData =
					data?.data?.data &&
					Array.isArray(data.data.data) &&
					data.data.data.length ===
						(Number(import.meta.env.VITE_DEFAULT_PAGINATION_LIMIT) || 15);

				if (
					entries[0].isIntersecting &&
					!isFetching &&
					hasMoreData &&
					!searchTerm
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, data, searchTerm]
	);

	return (
		<div className="max-w-[66rem] mx-auto">
			{role === UserRole.Admin && (
				<div className="flex justify-center items-center gap-3 mt-7 text-2xl font-bold text-mainPurple">
					Пользователи
				</div>
			)}
			<div className="my-5 px-10">
				<div className="flex items-center justify-center  min-w-full">
					<div className="flex justify-center items-center bg-gray-100 rounded-lg px-3 py-1 min-w-full max-w-md">
						<input
							className="bg-transparent p-3 w-full font-normal focus:outline-none"
							type="text"
							placeholder="Поиск пользователей"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
						{isFetching && searchTerm === searchInput ? (
							<Spinner className="w-6 h-6 animate-spin" />
						) : (
							<Search className="w-6 h-6" />
						)}
					</div>
				</div>
				<span className="text-xs text-gardenGreen italic">
					<b>*</b>Поиск будет осуществляться либо <b>ФИО</b>, либо по{" "}
					<b>Email</b>
				</span>
			</div>

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

			{isFetching && !isLoading && (
				<div className="flex justify-center items-center mt-4">
					<Spinner className="w-6 h-6 animate-spin" />
				</div>
			)}
			{isError && (
				<span className="block mx-auto text-center text-crimsonRed font-bold">
					Ошибка при загрузке данных
				</span>
			)}
			{allUsers.length === 0 && !isLoading && !isFetching && (
				<span className="block mx-auto text-center mt-10 font-bold text-gardenGreen">
					На данный момент нет пользователей
				</span>
			)}
		</div>
	);
};

export default UserConfigurationListForm;
