import React, { useState } from "react";
import Rectangle from "@assets/img/Rectangle.jpg";

const SecretaryForm = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [imageUrl, setImageUrl] = useState(Rectangle);
	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				setImageUrl(e.target.result);
			};

			reader.readAsDataURL(file);
		}
	};
	return (
		<form
			action=""
			className="max-w-[66rem] mx-auto mt-6 bg-gray-100 px-6 py-4  rounded-lg"
		>
			<div className="flex gap-3 font-bold items-center justify-between">
				<div className=" flex flex-grow items-center gap-3">
					<label className="text-statusSalate text-lg font-bold " htmlFor="fio">
						ФИО:
					</label>
					<input
						className="max-w-[18rem] flex-grow text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
						id="fio"
						type="text"
					/>
				</div>

				<div className="flex gap-4">
					<button
						type="button"
						className="rounded-xl px-5 py-2 bg-statusRed text-white text-xl "
					>
						Заморозить
					</button>
					<button
						className="rounded-xl px-5 py-2 bg-mainPurple text-white text-xl"
						onClick={toggleExpand}
						type="button"
					>
						{isExpanded ? "Скрыть" : "Показать"}
					</button>
				</div>
			</div>
			{isExpanded && (
				<div>
					<div className="flex mt-7 justify-between">
						<div className="mr-3">
							<label
								htmlFor="upload-photo"
								className="flex flex-col items-center  justify-center py-2  bg-inputPurple rounded-lg cursor-pointer"
							>
								<input
									type="file"
									id="upload-photo"
									accept="image/*"
									className="hidden"
									onChange={handleImageChange}
								/>
								<img
									src={imageUrl}
									alt="/"
									className="w-36 h-36 rounded-lg object-cover"
								/>
								<span className=" text-sm font-normal leading-none text-mainPurple mt-1 text-center">
									Нажмите, чтобы изменить фото
								</span>
							</label>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 gap-5 font-bold justify-around w-full">
							<div className="flex flex-col gap-1">
								<label className="text-statusSalate text-lg" htmlFor="name">
									Наименование отдела
								</label>
								<input
									className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
									id="name"
									type="text"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-statusSalate text-lg" htmlFor="login">
									Логин
								</label>
								<input
									className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
									id="login"
									type="text"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-statusSalate text-lg" htmlFor="email">
									E-mail
								</label>
								<input
									className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
									id="email"
									type="text"
								/>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-statusSalate text-lg" htmlFor="password">
									Пароль
								</label>
								<input
									className="text-mainPurple text-base bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-statusSalate focus:border-transparent"
									id="password"
									type="password"
								/>
							</div>
						</div>
					</div>
					<div className="w-full flex justify-end mt-4">
						<button className=" mt-2 rounded-xl px-14 py-2 bg-mainPurple text-white text-xl font-bold">
							Изменить
						</button>
					</div>
				</div>
			)}
		</form>
	);
};

export default SecretaryForm;
