import React from "react";
import StatWidget from "../statWidget/StatWidget";
import classNames from "classnames";
import Rectangle from "@assets/img/Rectangle.jpg";
interface SecretaryItemProps {
	fullName: string;
	isActive: boolean;
	onClick?: () => void;
}

const SecretaryItem = ({ fullName, onClick, isActive }: SecretaryItemProps) => {
	return (
		<li
			className={classNames(
				"shadow font-bold text-center p-2 rounded-md cursor-pointer ",
				{
					"bg-mainPurple text-white hover:bg-mainPurpleHover active:bg-mainPurpleActive":
						isActive,
					"bg-gray-100 text-mainPurple hover:bg-gray-200 active:bg-gray-300":
						!isActive,
				}
			)}
			onClick={onClick}
		>
			{fullName}
		</li>
	);
};

export default SecretaryItem;
