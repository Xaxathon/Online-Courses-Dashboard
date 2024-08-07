import { useEffect, useState, forwardRef, ChangeEvent, memo } from "react";

import AvatarError from "@assets/img/avatar.jpg";

import FreezeUserModal from "../freezeUserModal/FreezeUserModal";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import classNames from "classnames";

import { useUpdateUserMutation } from "@/api/authApi";

import { BaseUser, UserRole } from "@/shared/interfaces/user";

interface UserConfigurationFormProps {
	user: BaseUser;
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

const UserConfigurationForm = memo(
	forwardRef<HTMLFormElement, UserConfigurationFormProps>(({ user }, ref) => {
		const [isExpanded, setIsExpanded] = useState(false);
		const [isEditing, setIsEditing] = useState<boolean>(false);
		const [imageUrl, setImageUrl] = useState(user.avatar || AvatarError);
		const [showPassword, setShowPassword] = useState<boolean>(false);
		const [isFrozen, setIsFrozen] = useState(user.is_active === false);
		const [showFreezeModal, setShowFreezeModal] = useState(false);

		const [updateUser, { error, isLoading: isUpdateLoading }] =
			useUpdateUserMutation();

		useEffect(() => {
			if (user.avatar) {
				setImageUrl(user.avatar);
			}
		}, [user.avatar]);

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
			password: Yup.string().min(
				6,
				"Пароль должен содержать минимум 6 символов"
			),
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

			data.append("is_active", isFrozen ? "0" : "1");

			const response = await updateUser({ id: user.id, data });

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

		const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];

			if (file) {
				const reader = new FileReader();

				reader.onload = (e: ProgressEvent<FileReader>) => {
					setImageUrl(e.target?.result as string);
				};

				reader.readAsDataURL(file);
			}
		};

		const confirmFreeze = async () => {
			const data = new FormData();
			data.append("is_active", "0");

			const response = await updateUser({ id: user.id, data });

			if (!("error" in response)) {
				setIsFrozen(true);
				setIsEditing(false);
			}
			setShowFreezeModal(false);
		};

		return (
			<>
				<Formik
					initialValues={{
						full_name: user.full_name || "",
						department: user.department || "",
						email: user.email || "",
						password: "",
					}}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ setFieldValue }) => (
						<Form ref={ref} className="mt-6 bg-gray-100 px-6 py-4 rounded-lg">
							<div className="flex gap-3  items-center justify-between">
								<div
									className={classNames("flex flex-grow items-center gap-3", {
										"opacity-50": !isEditing || isFrozen,
									})}
								>
									<label
										className="text-gardenGreen text-lg font-bold "
										htmlFor={`full_name_${user.id}`}
									>
										ФИО:
									</label>
									<Field
										className="max-w-[17rem] flex-grow text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
										id={`full_name_${user.id}`}
										name="full_name"
										type="text"
										disabled={!isEditing || isFrozen}
									/>
									<ErrorMessage
										name="full_name"
										component="div"
										className="text-crimsonRed text-sm"
									/>
								</div>
								<div className="flex gap-4">
									{user.role === UserRole.Secretary && !isFrozen && (
										<button
											type="button"
											className="rounded-xl px-5 py-2 bg-crimsonRed text-white text-xl hover:bg-crimsonRedHover active:bg-crimsonRedActive"
											onClick={() => setShowFreezeModal(true)}
										>
											Заморозить
										</button>
									)}
									{isFrozen && (
										<button
											type="button"
											className="rounded-xl px-5 py-2 bg-gray-500 text-white text-xl cursor-not-allowed"
											disabled
										>
											Заморожено
										</button>
									)}
									<button
										className="rounded-xl px-5 py-2 bg-mainPurple text-white text-xl hover:bg-mainPurpleHover active:bg-mainPurpleActive"
										onClick={() => setIsExpanded(!isExpanded)}
										type="button"
									>
										{isExpanded ? "Скрыть" : "Показать"}
									</button>
								</div>
							</div>
							{isExpanded && (
								<div>
									<div
										className={classNames("flex mt-7 justify-between", {
											"opacity-50": !isEditing || isFrozen,
										})}
									>
										<div className="mr-3">
											<label
												htmlFor={`upload-photo_${user.id}`}
												className={classNames(
													"flex flex-col items-center justify-center py-2 bg-lightPurple rounded-lg",
													{
														"cursor-not-allowed": !isEditing || isFrozen,
														"cursor-pointer hover:bg-lightPurpleHover active:bg-white":
															isEditing && !isFrozen,
													}
												)}
											>
												<input
													type="file"
													id={`upload-photo_${user.id}`}
													alt="avatar"
													accept="image/*"
													className="hidden"
													onChange={(e) => {
														handleImageChange(e);
														setFieldValue("avatar", e.target.files?.[0]);
													}}
													disabled={!isEditing || isFrozen}
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
										<div className="grid grid-cols-2 grid-rows-2 gap-5 justify-around w-full ">
											<div className="flex flex-col gap-1 font-bold ">
												<label
													className="text-gardenGreen text-lg"
													htmlFor={`department_${user.id}`}
												>
													Наименование отдела
												</label>
												<Field
													className="text-mainPurple text-base bg-white p-3 font-normal rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
													id={`department_${user.id}`}
													name="department"
													type="text"
													disabled={!isEditing || isFrozen}
												/>
												<ErrorMessage
													name="department"
													component="div"
													className="text-crimsonRed text-sm"
												/>
											</div>

											<div className="flex flex-col gap-1">
												<label
													className="text-gardenGreen text-lg font-bold "
													htmlFor={`email_${user.id}`}
												>
													E-mail
												</label>
												<Field
													className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
													id={`email_${user.id}`}
													name="email"
													type="text"
													disabled={!isEditing || isFrozen}
												/>
												<ErrorMessage
													name="email"
													component="div"
													className="text-crimsonRed text-sm"
												/>
											</div>
											<div className="flex flex-col gap-1">
												<label
													className="text-gardenGreen text-lg font-bold "
													htmlFor={`password_${user.id}`}
												>
													Пароль
												</label>
												<div className="relative w-full">
													<Field
														className="w-full text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gardenGreen focus:border-transparent"
														id={`password_${user.id}`}
														name="password"
														type={showPassword ? "text" : "password"}
														disabled={!isEditing || isFrozen}
														autoComplete="off"
													/>
													<button
														type="button"
														className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
														onClick={() => setShowPassword(!showPassword)}
														disabled={!isEditing || isFrozen}
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
										</div>
									</div>
									{error && (
										<span className="block mt-1 font-bold text-crimsonRed text-sm">
											{(error as ApiError).data?.message ||
												"Ошибка при обновлении данных"}
										</span>
									)}
									<div className="w-full flex justify-end mt-4">
										{isEditing && !isFrozen ? (
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
										) : !isFrozen ? (
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
										) : null}
									</div>
									<ErrorMessage
										name="submit"
										component="div"
										className="text-crimsonRed text-sm mt-2"
									/>
								</div>
							)}
						</Form>
					)}
				</Formik>
				{showFreezeModal && (
					<FreezeUserModal
						onClose={() => setShowFreezeModal(false)}
						onFreeze={confirmFreeze}
						userName={user.full_name}
					/>
				)}
			</>
		);
	})
);

export default UserConfigurationForm;
