import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../../api/authApi";
import Rectangle from "@assets/img/Rectangle.jpg";
import classNames from "classnames";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

import { BaseUser, FormValues } from "../../shared/interfaces/user";

interface UserFormProps {
	userData: BaseUser;
}

const UserForm = ({ userData }: UserFormProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState(userData.avatar || Rectangle);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [backendErrors, setBackendErrors] = useState<string | null>(null);
	const [updateUser] = useUpdateUserMutation();
	useEffect(() => {
		if (userData.avatar) {
			setImageUrl(userData.avatar);
		}
	}, [userData.avatar]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e: ProgressEvent<FileReader>) => {
				setImageUrl(e.target?.result as string);
			};

			reader.readAsDataURL(file);
		}
	};
	console.log(userData);

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
		password: Yup.string().min(6, "Пароль должен содержать минимум 6 символов"),
	});

	const handleSubmit = async (
		values: FormValues,
		{ setSubmitting, setErrors }: FormikHelpers<FormValues>
	) => {
		setBackendErrors(null);
		const data = new FormData();
		for (const key in values) {
			if (values[key as keyof FormValues]) {
				data.append(key, values[key as keyof FormValues] as Blob | string);
			}
		}

		const response = await updateUser({ id: userData.id, data });

		if ("error" in response && response.error) {
			if ("data" in response.error && response.error.data) {
				setErrors((response.error.data as any).errors || {});
				setBackendErrors(
					"Ошибка при обновлении данных: " +
						(response.error.data as any).message
				);
			} else {
				setBackendErrors("Ошибка при обновлении данных");
			}
		} else {
			setIsEditing(false);
		}
		setSubmitting(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	return (
		<Formik
			initialValues={{
				full_name: userData.full_name || "",
				department: userData.department || "",
				login: userData.login || "",
				email: userData.email || "",
				password: "",
			}}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, setFieldValue }) => (
				<Form>
					<div
						className={classNames("flex items-center gap-3 font-bold", {
							"opacity-50": !isEditing,
						})}
					>
						<label className="text-gardenGreen text-lg" htmlFor="full_name">
							ФИО:
						</label>
						<Field
							className="max-w-[17rem] flex-grow text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
							id="full_name"
							name="full_name"
							type="text"
							disabled={!isEditing}
						/>
						<ErrorMessage
							name="full_name"
							component="span"
							className="text-crimsonRed text-sm"
						/>
					</div>
					<div
						className={classNames("flex mt-8 justify-between", {
							"opacity-50": !isEditing,
						})}
					>
						<div className="mr-3">
							<label
								htmlFor="upload-photo"
								className={classNames(
									"flex flex-col items-center justify-center py-2 bg-lightPurple   rounded-lg ",
									{
										"cursor-not-allowed": !isEditing,
										"cursor-pointer hover:bg-lightPurpleHover active:bg-white":
											isEditing,
									}
								)}
							>
								<input
									type="file"
									id="upload-photo"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										handleImageChange(e);
										setFieldValue("avatar", e.target.files?.[0]);
									}}
									disabled={!isEditing}
								/>
								<img
									src={imageUrl}
									alt="/"
									className="w-36 h-36 rounded-lg object-cover"
								/>
								<span className="text-sm font-normal leading-none text-mainPurple hover:text-mainPurpleHover active:text-mainPurpleActive mt-1 text-center">
									Нажмите, чтобы изменить фото
								</span>
							</label>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-2 font-bold justify-around w-full">
							<div className="flex flex-col gap-1">
								<label
									className="text-gardenGreen text-lg"
									htmlFor="department"
								>
									Наименование отдела
								</label>
								<Field
									className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
									id="department"
									name="department"
									type="text"
									disabled={!isEditing}
								/>
								<ErrorMessage
									name="department"
									component="span"
									className="text-crimsonRed text-sm"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-gardenGreen text-lg" htmlFor="login">
									Логин
								</label>
								<Field
									className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
									id="login"
									name="login"
									type="text"
									disabled={!isEditing}
								/>
								<ErrorMessage
									name="login"
									component="span"
									className="text-crimsonRed text-sm"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-gardenGreen text-lg" htmlFor="email">
									E-mail
								</label>
								<Field
									className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
									id="email"
									name="email"
									type="text"
									disabled={!isEditing}
								/>
								<ErrorMessage
									name="email"
									component="span"
									className="text-crimsonRed text-sm"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-gardenGreen text-lg" htmlFor="password">
									Пароль
								</label>
								<div className="relative w-full">
									<Field
										className="w-full text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										disabled={!isEditing}
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
										onClick={() => setShowPassword(!showPassword)}
										disabled={!isEditing}
									>
										{showPassword ? "Скрыть" : "Показать"}
									</button>
								</div>
								<ErrorMessage
									name="password"
									component="span"
									className="text-crimsonRed text-sm"
								/>
							</div>
						</div>
					</div>
					{backendErrors && (
						<div className="mt-1 font-bold text-crimsonRed text-sm">
							{backendErrors}
						</div>
					)}
					<div className="w-full flex justify-end mt-4">
						{isEditing ? (
							<>
								<button
									type="button"
									className={classNames(
										"mt-4 rounded-xl px-14 py-2 bg-gray-500 text-white text-xl font-bold mr-2 hover:bg-gray-600 active:bg-gray-400",
										{
											"opacity-50 cursor-not-allowed": isSubmitting,
										}
									)}
									onClick={handleCancel}
									disabled={isSubmitting}
								>
									Отменить
								</button>
								<button
									type="submit"
									className={classNames(
										"mt-4 rounded-xl px-14 py-2 bg-mainPurple text-white text-xl font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive",
										{
											"opacity-50 cursor-not-allowed": isSubmitting,
										}
									)}
									disabled={isSubmitting}
								>
									Сохранить
								</button>
							</>
						) : (
							<button
								type="button"
								className={classNames(
									"mt-4 rounded-xl px-14 py-2 bg-mainPurple text-white text-xl font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive",
									{
										"opacity-50 cursor-not-allowed": isSubmitting,
									}
								)}
								onClick={() => setIsEditing(true)}
								disabled={isSubmitting}
							>
								Изменить
							</button>
						)}
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default UserForm;
