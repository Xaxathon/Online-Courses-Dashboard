import React from "react";
import Backward from "@assets/icons/backward.svg";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";
import KeywordsList from "../../components/keywordsList/KeywordsList";

const Keywords = () => {
	return (
		<div className=" mt-7 w-full mr-4">
			<div className=" min-w-full flex items-center justify-between py-2 px-10 font-bold text-mainPurple  rounded-xl bg-gray-100">
				<Backward className="w-9 h-9 cursor-pointer" />

				<h1 className="text-center w-full lg:text-2xl text-xl">
					Ключевые слова
				</h1>

				<AddProtocolIcon className="w-9 h-9 cursor-pointer" />
			</div>
			<div className="max-w-[69rem] grid grid-cols-2 items-center mt-10 gap-3 font-bold mx-auto text-mainPurple text-lg rounded-xl bg-gray-100  py-4 px-8">
				<h2>Название</h2>
				<h2>Фраза</h2>
			</div>
			<KeywordsList />
		</div>
	);
};

export default Keywords;
