import { forwardRef } from "react";

import classNames from "classnames";

interface SecretaryItemProps {
	fullName: string;
	isActive: boolean;
	onClick?: () => void;
}

const SecretaryItem = forwardRef<HTMLLIElement, SecretaryItemProps>(
	({ fullName, onClick, isActive }, ref) => {
		return (
			<li
				ref={ref}
				className={classNames(
					"shadow font-bold text-center p-2 rounded-md cursor-pointer",
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
	}
);

SecretaryItem.displayName = "SecretaryItem";

export default SecretaryItem;
