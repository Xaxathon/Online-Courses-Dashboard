import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../../api/authApi";
import Rectangle from "@assets/img/Rectangle.jpg";
import classNames from "classnames";

const UserForm = ({ userData }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [imageUrl, setImageUrl] = useState(userData.avatar || Rectangle);
	const [formData, setFormData] = useState({
		full_name: userData.full_name || "",
		department: userData.department || "",
		login: userData.login || "",
		email: userData.email || "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [errors, setErrors] = useState({});
	const [updateUser] = useUpdateUserMutation();

	useEffect(() => {
		if (userData.avatar) {
			setImageUrl(userData.avatar);
		}
	}, [userData.avatar]);

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				setImageUrl(e.target.result);
			};

			reader.readAsDataURL(file);
			setFormData((prevData) => ({
				...prevData,
				avatar: file,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		for (const key in formData) {
			if (formData[key]) {
				data.append(key, formData[key]);
			}
		}

		const response = await updateUser({ id: userData.id, data });

		if ("error" in response) {
			// Обработка ошибки
			setErrors(response.error.data.errors || {});
		} else {
			// Успешное обновление пользователя
			setErrors({});
			setIsEditing(false);
		}
	};

	const handleCancel = () => {
		// Отмена изменений и возврат к исходным данным пользователя
		setFormData({
			full_name: userData.full_name || "",
			department: userData.department || "",
			login: userData.login || "",
			email: userData.email || "",
			password: "",
		});
		setImageUrl(userData.avatar || Rectangle);
		setIsEditing(false);
		setErrors({});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div
				className={classNames("flex items-center gap-3 font-bold", {
					"opacity-50": !isEditing,
				})}
			>
				<label className="text-statusSalate text-lg" htmlFor="full_name">
					ФИО:
				</label>
				<input
					className="max-w-[17rem] flex-grow text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
					id="full_name"
					type="text"
					value={formData.full_name}
					onChange={handleInputChange}
					disabled={!isEditing}
				/>
				{errors.full_name && (
					<span className="text-red-500 text-sm">{errors.full_name}</span>
				)}
			</div>
			<div
				className={classNames("flex mt-8 justify-between", {
					"opacity-50": !isEditing,
				})}
			>
				<div
					className={classNames("mr-3", {
						"opacity-50 cursor-not-allowed": !isEditing,
						"cursor-pointer": isEditing,
					})}
				>
					<label
						htmlFor="upload-photo"
						className="flex flex-col items-center justify-center py-2 bg-inputPurple rounded-lg "
					>
						<input
							type="file"
							id="upload-photo"
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
							disabled={!isEditing}
						/>
						<img
							src={imageUrl}
							alt="/"
							className="w-36 h-36 rounded-lg object-cover"
						/>
						<span className="text-sm font-normal leading-none text-mainPurple mt-1 text-center">
							Нажмите, чтобы изменить фото
						</span>
					</label>
				</div>
				<div className="grid grid-cols-2 grid-rows-2 gap-2 font-bold justify-around w-full">
					<div className="flex flex-col gap-1">
						<label className="text-statusSalate text-lg" htmlFor="department">
							Наименование отдела
						</label>
						<input
							className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="department"
							type="text"
							value={formData.department}
							onChange={handleInputChange}
							disabled={!isEditing}
						/>
						{errors.department && (
							<span className="text-red-500 text-sm">{errors.department}</span>
						)}
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-statusSalate text-lg" htmlFor="login">
							Логин
						</label>
						<input
							className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="login"
							type="text"
							value={formData.login}
							onChange={handleInputChange}
							disabled={!isEditing}
						/>
						{errors.login && (
							<span className="text-red-500 text-sm">{errors.login}</span>
						)}
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-statusSalate text-lg" htmlFor="email">
							E-mail
						</label>
						<input
							className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
							id="email"
							type="text"
							value={formData.email}
							onChange={handleInputChange}
							disabled={!isEditing}
						/>
						{errors.email && (
							<span className="text-red-500 text-sm">{errors.email}</span>
						)}
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-statusSalate text-lg" htmlFor="password">
							Пароль
						</label>
						<div className="relative w-full">
							<input
								className="w-full text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
								id="password"
								type="text"
								value={formData.password}
								onChange={handleInputChange}
								disabled={!isEditing}
								type={showPassword ? "text" : "password"}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none "
								onClick={() => setShowPassword(!showPassword)}
								disabled={!isEditing}
							>
								{showPassword ? "Скрыть" : "Показать"}
							</button>
						</div>

						{errors.password && (
							<span className="text-red-500 text-sm">{errors.password}</span>
						)}
					</div>
				</div>
			</div>
			<div className="w-full flex justify-end mt-4">
				{isEditing ? (
					<>
						<button
							type="button"
							className="mt-4 rounded-xl px-14 py-2 bg-gray-500 text-white text-xl font-bold mr-2"
							onClick={handleCancel}
						>
							Отменить
						</button>
						<button
							type="submit"
							className="mt-4 rounded-xl px-14 py-2 bg-mainPurple text-white text-xl font-bold"
						>
							Сохранить
						</button>
					</>
				) : (
					<button
						type="button"
						className="mt-4 rounded-xl px-14 py-2 bg-mainPurple text-white text-xl font-bold"
						onClick={() => setIsEditing(true)}
					>
						Изменить
					</button>
				)}
			</div>
		</form>
	);
};

export default UserForm;
