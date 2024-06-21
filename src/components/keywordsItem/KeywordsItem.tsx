import React from "react";
import Change from "@assets/icons/change.svg";

const KeywordsItem = () => {
	return (
		<li className="relative max-w-[69rem] mb-5  grid grid-cols-2 items-center pr-10 justify-center gap-3 mx-auto  text-statusSalate text-base font-normal rounded-xl bg-gray-100 py-7  px-8 ">
			<span>Приветствие</span>
			<span> Фраз</span>
			<Change className="absolute top-50% right-5 cursor-pointer h-9 w-9  " />
		</li>
	);
};

export default KeywordsItem;
