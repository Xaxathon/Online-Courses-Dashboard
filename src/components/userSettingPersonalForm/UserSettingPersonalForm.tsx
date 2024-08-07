import React, { useState, useEffect } from "react";

import AvatarError from "@assets/img/avatar.jpg";
import classNames from "classnames";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

import { useUpdateUserMutation } from "@/api/authApi";

import { BaseUser } from "@/shared/interfaces/user";

interface UserSettingPersonalFormProps {
	userData: BaseUser;
}

interface ApiError {
	data?: {
		message?: string;
		errors?: Record<string, string[]>;
	};
}

export interface FormValues {
	full_name: string;
	department: string;
	email: string;
	password: string;
	avatar?: File;
	is_active?: boolean;
}

const UserSettingPersonalForm = ({
	userData,
}: UserSettingPersonalFormProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState(userData.avatar || AvatarError);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [updateUser, { error, isLoading: isUpdateLoading }] =
		useUpdateUserMutation();

	useEffect(() => {
		if (userData.avatar) {
			setImageUrl(userData.avatar);
		}
	}, [userData.avatar]);

	const validationSchema = Yup.object({
		full_name: Yup.string()
			.min(5, "Поле должно содержать минимум 5 символов")
			.max(50, "Поле должно содержать максимум 50 символов")
			.required("Поле обязательно для заполнения"),
		department: Yup.string()
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
		const data = new FormData();
		for (const key in values) {
			if (values[key as keyof FormValues]) {
				data.append(key, values[key as keyof FormValues] as Blob | string);
			}
		}

		const avatar = document.getElementById("upload-photo") as HTMLInputElement;
		if (avatar && avatar.files && avatar.files[0]) {
			data.append("avatar", avatar.files[0]);
		}

		const response = await updateUser({ id: userData.id, data });

		if ("error" in response && response.error) {
			const apiError = response.error as ApiError;
			if (apiError.data?.errors) {
				const formattedErrors: Record<string, string> = {};
				for (const [key, messages] of Object.entries(apiError.data.errors)) {
					formattedErrors[key] = messages.join(", ");
				}
				setErrors(formattedErrors);
			}
		} else {
			setIsEditing(false);
		}
		setSubmitting(false);
	};

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

	return (
		<Formik
			initialValues={{
				full_name: userData.full_name || "",
				department: userData.department || "",
				email: userData.email || "",
				password: "",
			}}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
		>
			{({ setFieldValue }) => (
				<Form>
					<div
						className={classNames("flex items-center gap-3", {
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
									alt="avatar"
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
						<div className="grid grid-cols-2 grid-rows-2 gap-2 justify-around w-full">
							<div className="flex flex-col gap-1">
								<label
									className="text-gardenGreen text-lg font-bold"
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
								<label
									className="text-gardenGreen text-lg font-bold"
									htmlFor="email"
								>
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
								<label
									className="text-gardenGreen text-lg font-bold"
									htmlFor="password"
								>
									Пароль
								</label>
								<div className="relative w-full">
									<Field
										className="w-full text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										disabled={!isEditing}
										autoComplete="off"
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
					{error && (
						<div className="mt-1 font-bold text-crimsonRed text-sm">
							{(error as ApiError).data?.message ||
								"Ошибка при обновлении данных. Пожалуйста, попробуйте еще раз."}
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
											"opacity-50 cursor-not-allowed": isUpdateLoading,
										}
									)}
									onClick={() => setIsEditing(false)}
									disabled={isUpdateLoading}
								>
									Отменить
								</button>
								<button
									type="submit"
									className={classNames(
										"mt-4 rounded-xl px-14 py-2 bg-mainPurple text-white text-xl font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive",
										{
											"opacity-50 cursor-not-allowed": isUpdateLoading,
										}
									)}
									disabled={isUpdateLoading}
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
										"opacity-50 cursor-not-allowed": isUpdateLoading,
									}
								)}
								onClick={() => setIsEditing(true)}
								disabled={isUpdateLoading}
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

export default UserSettingPersonalForm;
