import { useState, useEffect, useRef, useCallback } from "react";

import { ReactComponent as Search } from "@assets/icons/search.svg";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";
import { ReactComponent as AddUserIcon } from "@assets/icons/add-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/icons/сlose-icon.svg";

import Modal from "../modal/Modal";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useFetchUsersQuery, useCreateUserMutation } from "@/api/authApi";

import { InternalUser, ExternalUser, UserRole } from "@/shared/interfaces/user";

interface ExternalUserAddModalProps {
	onClose: () => void;
	onUserSelect: (user: InternalUser | ExternalUser) => void;
	selectedMembers?: { id: number; full_name: string; email: string }[];
}

interface ApiResponse {
	data: {
		data: (InternalUser | ExternalUser)[];
		meta: {
			current_page: number;
			last_page: number;
			total: number;
		};
	};
}

const UserSchema = Yup.object().shape({
	full_name: Yup.string()
		.required("Обязательное поле")
		.min(5, "Поле должно содержать минимум 5 символов")
		.max(50, "Поле должно содержать максимум 50 символов"),
	email: Yup.string().email("Неверный формат email"),
});

const DEFAULT_LIMIT = 15;
const MIN_USERS_TO_SHOW_MESSAGE = 2;
const SEARCH_DELAY = 300;

const ExternalUserAddModal: React.FC<ExternalUserAddModalProps> = ({
	onClose,
	onUserSelect,
	selectedMembers = [],
}) => {
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [allUsers, setAllUsers] = useState<(InternalUser | ExternalUser)[]>([]);
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [selectedUser, setSelectedUser] = useState<
		InternalUser | ExternalUser | null
	>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { data, isLoading, isError, isFetching, refetch } = useFetchUsersQuery(
		{
			limit: searchTerm ? undefined : DEFAULT_LIMIT,
			page: searchTerm ? undefined : page,
			search: searchTerm,
		},
		{
			skip: false,
		}
	) as {
		data?: ApiResponse;
		isLoading: boolean;
		isError: boolean;
		isFetching: boolean;
		refetch: () => void;
	};

	const [createUser] = useCreateUserMutation();

	const observer = useRef<IntersectionObserver | null>(null);

	const lastUserElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					!isFetching &&
					!searchTerm &&
					data?.data.data.length === DEFAULT_LIMIT
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, data, searchTerm]
	);

	useEffect(() => {
		if (searchTerm) {
			setIsSearchMode(true);
			setPage(1);
		} else {
			setIsSearchMode(false);
			setPage(1);
			refetch();
		}
	}, [searchTerm, refetch]);

	useEffect(() => {
		if (data?.data.data) {
			setAllUsers((prevUsers) => {
				const newUsers = data.data.data;
				if (isSearchMode || page === 1) {
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
	}, [data, page, isSearchMode]);

	useEffect(() => {
		if (!isLoading && !isFetching) {
			setInitialLoadComplete(true);
		}
	}, [isLoading, isFetching]);

	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		if (searchInput !== searchTerm) {
			searchTimeoutRef.current = setTimeout(() => {
				setSearchTerm(searchInput);
			}, SEARCH_DELAY);
		}

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchInput]);

	const handleCreateUser = async (
		values: ExternalUser,
		{
			setSubmitting,
			setErrors,
		}: {
			setSubmitting: (isSubmitting: boolean) => void;
			setErrors: (errors: any) => void;
		}
	) => {
		setServerError(null);
		try {
			const createdUser: any = await createUser(values).unwrap();
			setSelectedUser(createdUser);
			setIsCreating(false);
			setSearchTerm("");
			refetch();
			setSubmitting(false);
		} catch (error: any) {
			setSubmitting(false);
			if (error.data && error.data.errors) {
				setErrors(error.data.errors);
			} else {
				setServerError("Не удалось создать пользователя. Попробуйте еще раз.");
			}
		}
	};

	const handleUserClick = (user: InternalUser | ExternalUser) => {
		if (selectedUser?.id === user.id) {
			setSelectedUser(null);
		} else {
			setSelectedUser(user);
		}
	};

	const toggleCreating = () => {
		setIsCreating(!isCreating);
		if (isCreating) {
			setServerError(null);
		}
	};

	const showNoMoreUsersMessage =
		!isFetching &&
		initialLoadComplete &&
		allUsers.length >= MIN_USERS_TO_SHOW_MESSAGE &&
		!isSearchMode &&
		(data?.data.data.length ?? 0) < DEFAULT_LIMIT;

	return (
		<Modal onClose={onClose}>
			<div className="mt-14 w-[35rem] text-xl font-bold text-mainPurple text-center">
				<div className="flex items-center justify-center mt-2 mb-5 gap-2">
					<div className="flex justify-center items-center bg-gray-100 rounded-lg px-3 py-1 w-full">
						<input
							className="bg-transparent p-2 w-full focus:outline-none"
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
					{isCreating ? (
						<CloseIcon
							className="w-10 h-10 cursor-pointer stroke-[0.20rem] stroke-mainPurple hover:stroke-mainPurpleHover active:stroke-mainPurpleActive"
							onClick={toggleCreating}
						/>
					) : (
						<AddUserIcon
							className="w-10 h-10 cursor-pointer"
							onClick={toggleCreating}
						/>
					)}
				</div>
				{!isCreating && (
					<div className="font-normal text-sm">
						<ul className="flex flex-col gap-2 h-[20rem] overflow-y-auto">
							{isLoading && <div>Загрузка...</div>}
							{isError && <div>Ошибка загрузки данных</div>}
							{allUsers.map((user, index) => (
								<li
									key={user.id}
									ref={
										allUsers.length === index + 1 ? lastUserElementRef : null
									}
									className={`flex justify-between items-center p-3 rounded cursor-pointer ${
										selectedUser?.id === user.id ? "bg-blue-200" : "bg-gray-200"
									}`}
									onClick={() => handleUserClick(user)}
								>
									<span className="font-bold flex-grow">{user.full_name}</span>
									<span className="flex-grow">{user.email}</span>
								</li>
							))}
							{showNoMoreUsersMessage && (
								<div className="text-center mt-4 text-mainPurple">
									Больше нет пользователей для загрузки
								</div>
							)}
							{allUsers.length === 0 && !isLoading && !isFetching && (
								<div className="text-center mt-4">
									<p>Пользователи не найдены</p>
								</div>
							)}
						</ul>
					</div>
				)}
				{isCreating && (
					<Formik
						initialValues={{
							full_name: "",
							email: "",
							external: true,
							role: UserRole.External,
						}}
						validationSchema={UserSchema}
						onSubmit={handleCreateUser}
					>
						{({ isSubmitting, isValid }) => (
							<Form className="flex flex-col items-center mt-10">
								<div className="flex flex-col w-full mb-5">
									<Field
										className="w-full  text-mainPurple text-sm bg-white py-3 px-2 rounded-lg outline-none ring-2 focus:bg-lightPurple focus:ring-mainPurple border-transparent ring-mainPurple mb-2"
										type="text"
										name="full_name"
										placeholder="Введите имя пользователя"
									/>
									<ErrorMessage
										name="full_name"
										component="span"
										className="text-start text-crimsonRed text-sm"
									/>
								</div>
								<div className="flex flex-col w-full mb-5">
									<Field
										className="w-full py-3 px-2 text-mainPurple text-sm bg-white rounded-lg outline-none ring-2 focus:bg-lightPurple focus:ring-mainPurple border-transparent ring-mainPurple mb-2"
										type="email"
										name="email"
										placeholder="Введите email (необязательно)"
									/>
									<ErrorMessage
										name="email"
										component="span"
										className="text-start text-crimsonRed text-sm"
									/>
								</div>

								{serverError && (
									<div className="flex text-crimsonRed text-base">
										{serverError}
									</div>
								)}
								<div className="flex gap-4 mb-20">
									<button
										className="mt-5 bg-gray-500 text-gray-300 rounded-lg px-3 py-2 font-bold hover:text-gray-400 active:text-gray-300  hover:bg-gray-300 active:bg-gray-300"
										type="button"
										onClick={() => setIsCreating(false)}
									>
										Отменить
									</button>
									<button
										className="mt-5 bg-mainPurple text-white rounded-lg px-10 py-2 font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive"
										type="submit"
										disabled={isSubmitting || !isValid}
									>
										Создать
									</button>
								</div>
							</Form>
						)}
					</Formik>
				)}
				<button
					className={`mt-5 rounded-lg px-3 py-2 font-bold ${
						selectedUser
							? "bg-mainPurple text-white hover:bg-mainPurpleHover active:bg-mainPurpleActive"
							: "bg-gray-500 text-gray-300 cursor-not-allowed"
					}`}
					onClick={() => {
						if (selectedUser) {
							onUserSelect(selectedUser);
							onClose();
						}
					}}
					disabled={!selectedUser}
				>
					Добавить
				</button>
			</div>
		</Modal>
	);
};

export default ExternalUserAddModal;
