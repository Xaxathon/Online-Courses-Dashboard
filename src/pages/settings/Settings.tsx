import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { UserRole } from "../../shared/interfaces/user";
const Settings = () => {
	const role = useSelector((state: RootState) => state.auth.role);
	return (
		<div className="mt-7 w-full mr-4 px-10">
			<h1 className="w-full font-bold mx-auto text-mainPurple text-2xl  py-3 rounded-xl bg-gray-100 flex items-center justify-center px-7 ">
				Настройки
			</h1>
			<div className="flex flex-col gap-5 mt-10 px-5">
				{role === UserRole.Secretary && (
					<Link
						to="/main/settings/keywords"
						className="w-full font-bold mx-auto text-mainPurple text-base cursor-pointer py-4 rounded-xl bg-gray-100 flex items-center justify-start px-7"
					>
						Ключевые слова
					</Link>
				)}
				<Link
					to="/main/settings/users"
					className="w-full font-bold mx-auto text-mainPurple text-base cursor-pointer  py-4 rounded-xl bg-gray-100 flex items-center justify-start px-7 "
				>
					Данные о пользователях
				</Link>
			</div>
		</div>
	);
};

export default Settings;
