import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useCreateUserMutation } from "../../api/authApi";
import Modal from "../modal/Modal";
import {
	UserRole,
	CreateUserRequest,
	InternalUser,
} from "../../shared/interfaces/user";

interface UserAddFormModalProps {
	onClose: () => void;
	role: UserRole;
	refetchUsers: () => void;
}

const UserAddFormModal = ({
	onClose,
	role,
	refetchUsers,
}: UserAddFormModalProps) => {
	const [createUser, { isLoading }] = useCreateUserMutation();
	const [backendErrors, setBackendErrors] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const initialValues: Partial<Omit<InternalUser, "id">> & {
		password: string;
	} = {
		full_name: "",
		email: "",
		password: "",
		department: "",
		login: "",
		role: role === UserRole.Admin ? UserRole.Manager : UserRole.Secretary,
		is_active: true,
		external: false,
	};

	const validationSchema = Yup.object({
		full_name: Yup.string()
			.min(5, "Поле должно содержать минимум 5 символов")
			.max(50, "Поле должно содержать максимум 50 символов")
			.required("Поле обязательно для заполнения"),
		department: Yup.string()
			.min(5, "Поле должно содержать минимум 5 символов")
			.max(50, "Поле должно содержать максимум 50 символов")
			.required("Поле обязательно для заполнения"),
		login: Yup.string()
			.min(5, "Поле должно содержать минимум 5 символов")
			.max(50, "Поле должно содержать максимум 50 символов")
			.required("Поле обязательно для заполнения"),
		email: Yup.string()
			.email("Некорректный email")
			.required("Поле обязательно для заполнения"),
		password: Yup.string()
			.min(6, "Пароль должен содержать минимум 6 символов")
			.required("Поле обязательно для заполнения"),
	});

	const handleSubmit = async (
		values: typeof initialValues,
		{ setSubmitting, setErrors }: FormikHelpers<typeof initialValues>
	) => {
		try {
			await createUser(values as CreateUserRequest).unwrap();
			onClose();
			refetchUsers();
		} catch (err: any) {
			const errors: any = {};
			if (err.data?.errors) {
				for (const key in err.data.errors) {
					errors[key] = err.data.errors[key].join(", ");
				}
			} else {
				setBackendErrors(
					err.data?.message || "Не удалось создать пользователя"
				);
			}
			setErrors(errors);
		}
		setSubmitting(false);
	};

	return (
		<Modal onClose={onClose}>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				<Form className="w-[40rem] flex flex-col gap-4 mt-10 text-xl font-bold text-mainPurple">
					<span className="text-center">
						Добавление {role === UserRole.Admin ? "менеджера" : "секретаря"}
					</span>
					<div className="flex flex-col gap-1">
						<label htmlFor="full_name">ФИО</label>
						<Field
							className="text-mainPurple text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="full_name"
							name="full_name"
							type="text"
						/>
						<ErrorMessage
							name="full_name"
							component="div"
							className="text-crimsonRed text-sm"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="department">Информация об отделе</label>
						<Field
							className="text-mainPurple text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="department"
							name="department"
							type="text"
						/>
						<ErrorMessage
							name="department"
							component="div"
							className="text-crimsonRed text-sm"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="email">E-mail</label>
						<Field
							className="text-mainPurple text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="email"
							name="email"
							type="email"
						/>
						<ErrorMessage
							name="email"
							component="div"
							className="text-crimsonRed text-sm"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="login">Логин</label>
						<Field
							className="text-mainPurple text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="login"
							name="login"
							type="text"
						/>
						<ErrorMessage
							name="login"
							component="div"
							className="text-crimsonRed text-sm"
						/>
					</div>
					<div className="relative flex flex-col gap-1">
						<label htmlFor="password">Пароль</label>
						<div className="relative">
							<Field
								className="w-full text-mainPurple text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent pr-10"
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "Скрыть" : "Показать"}
							</button>
						</div>
						<ErrorMessage
							name="password"
							component="div"
							className="text-crimsonRed text-sm"
						/>
					</div>

					{backendErrors && (
						<div className="text-crimsonRed text-base mt-3 font-bold">
							{backendErrors}
						</div>
					)}

					<button
						type="submit"
						className="px-5 py-2 mx-auto text-white bg-mainPurple rounded-lg hover:bg-mainPurpleHover active:bg-mainPurpleActive"
						disabled={isLoading}
					>
						{isLoading ? "Загрузка..." : "Добавить"}
					</button>
				</Form>
			</Formik>
		</Modal>
	);
};

export default UserAddFormModal;
