import React from "react";
import SecretaryList from "../../components/secretaryList/SecretaryList";

import Search from "@assets/icons/search.svg";
import SecretaryCarousel from "../../components/secretaryCarousel/SecretaryCarousel";

const Secretaries = () => {
	return (
		<div className="mx-4 mt-7 w-full">
			<div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
				<div>
					<div className="flex justify-between gap-10 items-center mb-4">
						<div className="flex items-center w-full gap-3 xl:text-xl lg:text-lg text-sm text-mainPurple bg-gray-100 py-4 px-5 rounded-lg">
							<span className="">Дашборд менеджера: </span>
							<span className="font-bold">Иванов Иван Иванович</span>
						</div>
					</div>
					<SecretaryCarousel />
				</div>
				<div>
					<div className="flex justify-center items-center w-full bg-gray-100 mt-2 rounded-lg px-3 py-1 mb-5">
						<input
							className="bg-transparent p-2 w-full focus:outline-none"
							type="text"
							placeholder="Введите запрос"
						/>
						<Search className="w-6 h-6" />
					</div>
					<SecretaryList />
				</div>
			</div>
		</div>
	);
};

export default Secretaries;
