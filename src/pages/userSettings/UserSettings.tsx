import React from "react";
import Backward from "@assets/icons/backward.svg";
import SecretariesForm from "../../components/secretaryForm/SecretaryForm";
import UserForm from "../../components/userForm/UserForm";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";
import SecretariesListForm from "../../components/secretariesListForm/SecretariesListForm";

const UserSettings = () => {
	return (
		<div className=" mt-[30px] w-full mr-4 mb-20">
			<div className="font-bold text-mainPurple mx-auto text-[24px] max-w-[1245px] h-[51px] rounded-xl bg-gray-100 flex items-center justify-center relative px-[30px]">
				<div className="absolute left-0 ml-[30px] cursor-pointer">
					<Backward />
				</div>
				<h1 className="text-center w-full">Данные о пользователях</h1>
				<div className="absolute right-0 mr-[50px] flex gap-4 cursor-pointer">
					<AddProtocolIcon />
				</div>
			</div>
			<div className="mt-[25px]">
				<h2 className="font-bold text-mainPurple mx-auto text-[24px] text-center">
					Мой профиль
				</h2>

				<div className="w-[1064px] mx-auto mt-[25px] bg-gray-100 px-[25px] py-[15px]  rounded-lg">
					<UserForm />
				</div>
				<h3 className="font-bold text-mainPurple mx-auto text-[24px] text-center mt-[30px]">
					Секретари
				</h3>

				<SecretariesListForm />
			</div>
		</div>
	);
};

export default UserSettings;
