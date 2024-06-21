import React from "react";
import Backward from "@assets/icons/backward.svg";
import SecretariesForm from "../../components/secretaryForm/SecretaryForm";
import UserForm from "../../components/userForm/UserForm";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";
import SecretariesListForm from "../../components/secretariesListForm/SecretariesListForm";

const UserSettings = () => {
	return (
		<div className=" mt-7 w-full mr-4 mb-20">
			<div className="flex items-center justify-between font-bold text-mainPurple xl:text-2xl text-xl rounded-xl bg-gray-100  py-2 px-7 ">
				<Backward className="w-9 h-9 cursor-pointer" />
				<h1 className="text-center w-full">Данные о пользователях</h1>
				<AddProtocolIcon className="w-10 h-10 cursor-pointer" />
			</div>
			<div className="mt-6">
				<h2 className="font-bold text-mainPurple mx-auto text-2xl text-center">
					Мой профиль
				</h2>

				<div className="max-w-[66rem] mx-auto mt-6 bg-gray-100 px-6 py-4  rounded-lg">
					<UserForm />
				</div>
				<h3 className="font-bold text-mainPurple mx-auto text-2xl text-center mt-7">
					Секретари
				</h3>

				<SecretariesListForm />
			</div>
		</div>
	);
};

export default UserSettings;
