import React from "react";
import SecretaryList from "../../components/secretaryList/SecretaryList";

import Search from "@assets/icons/search.svg";
import SecretaryCarousel from "../../components/secretaryCarousel/SecretaryCarousel";

const Secretaries = () => {
	return (
		<div className="mx-4 mt-5 w-full">
			<div className="flex justify-between gap-10 items-center">
				<div className="flex w-full gap-3 items-center xl:text-[18px] lg:text-[16px] text-[13px] text-mainPurple bg-gray-100 py-4 px-5 rounded-lg">
					<span className="">Дашборд менеджера: </span>
					<span className="font-bold">Иванов Иван Иванович</span>
				</div>
				<div className="flex bg-gray-100 mt-2 rounded-lg justify-center items-center px-3 w-full xl:max-w-[787px] h-[46px]">
					<input
						className="bg-transparent p-2 w-full focus:outline-none"
						type="text"
						placeholder="Введите запрос"
					/>
					<Search />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-5 mt-5">
				<SecretaryCarousel />
				<SecretaryList />
			</div>
		</div>
	);
};

export default Secretaries;
