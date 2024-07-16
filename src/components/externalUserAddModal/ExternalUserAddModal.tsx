import { useState, useEffect, useRef } from "react";

import { ReactComponent as Search } from "@assets/icons/search.svg";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";
import { ReactComponent as AddUserIcon } from "@assets/icons/add-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/icons/сlose-icon.svg";

import Modal from "../modal/Modal";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

import { useFetchUsersQuery, useCreateUserMutation } from "@/api/authApi";

import { InternalUser, ExternalUser, UserRole } from "@/shared/interfaces/user";

// Добавил данный интерфейс для того, чтобы получить список пользователей
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

interface ExternalUserAddModalProps {
	onClose: () => void;
	onUserSelect: (user: InternalUser | ExternalUser) => void;
}
const UserSchema = Yup.object().shape({
	full_name: Yup.string()
		.required("Обязательное поле")
		.min(5, "Поле должно содержать минимум 5 символов")
		.max(50, "Поле должно содержать максимум 50 символов"),
	email: Yup.string().email("Неверный формат email"),
});

const DEFAULT_LIMIT = 15;
const SEARCH_DELAY = 500;

const ExternalUserAddModal = ({
	onClose,
	onUserSelect,
}: ExternalUserAddModalProps) => {
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [allUsers, setAllUsers] = useState<(InternalUser | ExternalUser)[]>([]);
	const [selectedUser, setSelectedUser] = useState<
		InternalUser | ExternalUser | null
	>(null);
	const [isCreating, setIsCreating] = useState(false);

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

	const [createUser, { isError: isCreateError }] = useCreateUserMutation();

	const observer = useRef<IntersectionObserver | null>(null);

	const lastUserElementRef = (node: HTMLElement | null) => {
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
	};

	useEffect(() => {
		if (data?.data.data) {
			setAllUsers((prevUsers) => {
				const newUsers = data.data.data;
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
		{ setSubmitting, setErrors }: FormikHelpers<ExternalUser>
	) => {
		try {
			{
				/* Не смог убрать тип any в этом месте, там должно возвращаться ExternalUser */
			}
			const createdUser: any = await createUser(values).unwrap();

			setSelectedUser(createdUser);
			setIsCreating(false);
			setSearchTerm("");
			refetch();
			setSubmitting(false);
		} catch (error) {
			setSubmitting(false);
			if (
				error &&
				typeof error === "object" &&
				"data" in error &&
				error.data &&
				typeof error.data === "object" &&
				"errors" in error.data
			) {
				setErrors(error.data.errors as Record<string, string>);
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
	};

	return (
		<Modal onClose={onClose}>
			<div className="mt-14 w-[35rem] text-xl font-bold text-mainPurple text-center">
				<div className="flex items-center justify-center mt-2 mb-5 gap-2">
					<div className="flex justify-center items-center bg-gray-100 rounded-lg px-3 py-1 w-full">
						<input
							className="bg-transparent p-2 w-full font-normal focus:outline-none"
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
							{isLoading && (
								<Spinner className="block w-8 h-8 animate-spin mx-auto" />
							)}
							{isError && (
								<span className="block mx-auto text-crimsonRed">
									Ошибка загрузки данных
								</span>
							)}
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
									<span className="font-bold flex-grow text-start">
										{user.full_name}
									</span>
									<span className="flex-grow text-end">{user.email}</span>
								</li>
							))}
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

								{isCreateError && (
									<span className="text-start text-crimsonRed text-base">
										Не удалось создать пользователя. Попробуйте еще раз.
									</span>
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
