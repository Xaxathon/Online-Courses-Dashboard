import React, { useState } from "react";
import Modal from "../modal/Modal";
import { ReactComponent as Search } from "@assets/icons/search.svg";
import { useFetchUsersQuery, useCreateUserMutation } from "../../api/authApi";
import {
	InternalUser,
	ExternalUser,
	UserRole,
} from "../../shared/interfaces/user";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface AppointmentAddUserModalProps {
	onClose: () => void;
	onUserSelect: (user: InternalUser | ExternalUser) => void;
	selectedMembers: { id: number; full_name: string; email: string }[];
}

const UserSchema = Yup.object().shape({
	full_name: Yup.string()
		.required("Обязательное поле")
		.min(5, "Поле должно содержать минимум 5 символов")
		.max(50, "Поле должно содержать максимум 50 символов"),
	email: Yup.string().email("Неверный формат email"),
});
const AppointmentAddUserModal: React.FC<AppointmentAddUserModalProps> = ({
	onClose,
	onUserSelect,
	selectedMembers,
}) => {
	const { data, isLoading, isError, refetch } = useFetchUsersQuery();
	const [createUser] = useCreateUserMutation();
	const users = data?.data?.data || [];
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedUser, setSelectedUser] = useState<
		InternalUser | ExternalUser | null
	>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [filter, setFilter] = useState<"internal" | "external">("internal");
	const [serverError, setServerError] = useState<string | null>(null);

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

	const filteredUsers = users.filter((user) => {
		const isSelected = selectedMembers.some((member) => member.id === user.id);
		const isMatch =
			user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchTerm.toLowerCase());
		const isRoleMatch =
			filter === "external"
				? user.role === "external"
				: user.role !== "external";
		return !isSelected && isMatch && isRoleMatch;
	});

	return (
		<Modal onClose={onClose}>
			<div className="mt-14 w-[35rem] text-xl font-bold text-mainPurple text-center">
				<div className="flex justify-center items-center bg-gray-100 mt-2 rounded-lg px-3 py-1 mb-5">
					<input
						className="bg-transparent p-2 w-full focus:outline-none"
						type="text"
						placeholder="Введите запрос"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search className="w-6 h-6" />
				</div>
				<div className="flex justify-center gap-4 mb-5">
					<button
						className={`px-4 py-2 rounded ${
							filter === "external" ? "bg-mainPurple text-white" : "bg-gray-200"
						}`}
						onClick={() => setFilter("external")}
					>
						Мои участники
					</button>
					<button
						className={`px-4 py-2 rounded ${
							filter === "internal" ? "bg-mainPurple text-white" : "bg-gray-200"
						}`}
						onClick={() => setFilter("internal")}
					>
						Другие
					</button>
				</div>
				{!isCreating && (
					<div className="font-normal text-sm">
						<ul className="flex flex-col gap-2 h-[20rem] overflow-y-auto">
							{isLoading && <div>Загрузка...</div>}
							{isError && <div>Ошибка загрузки данных</div>}
							{filteredUsers.map((user) => (
								<li
									key={user.id}
									className={`flex justify-between items-center p-3 rounded cursor-pointer ${
										selectedUser?.id === user.id ? "bg-blue-200" : "bg-gray-200"
									}`}
									onClick={() => handleUserClick(user)}
								>
									<span className="font-bold flex-grow">{user.full_name}</span>
									<span className="flex-grow">{user.email}</span>
								</li>
							))}
							{filteredUsers.length === 0 && searchTerm && (
								<div className="text-center mt-4">
									<button
										className="text-mainPurple rounded-lg px-5 py-3 font-bold hover:text-white active:text-white hover:bg-mainPurpleHover active:bg-mainPurpleActive"
										onClick={() => setIsCreating(true)}
									>
										Его нет в списке, создать пользователя?
									</button>
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

export default AppointmentAddUserModal;
