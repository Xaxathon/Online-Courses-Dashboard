import React from "react";
import StatWidget from "../statWidget/StatWidget";

import { ReactComponent as Left } from "@assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@assets/icons/right-arrow.svg";
import Rectangle from "@assets/img/Rectangle.jpg";

import Skeleton from "../skeleton/Skeleton";
import {
	FetchUsersResponse,
	InternalUser,
	User,
} from "../../shared/interfaces/user";
interface SecretaryCarouselProps {
	userData: any;
	isLoading: boolean;
	onLeftClick: () => void;
	onRightClick: () => void;
}

const SecretaryCarousel = ({
	userData,
	isLoading,
	onLeftClick,
	onRightClick,
}: SecretaryCarouselProps) => {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5">
				<Skeleton width="20" height="20" className="rounded-lg mb-4" />
				<Skeleton width="3/4" height="6" className="mb-2" />
				<Skeleton width="1/2" height="4" className="mb-2" />
				<Skeleton width="1/2" height="4" />
			</div>
		);
	}
	return (
		<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 ">
			<div className="w-full bg-time-gradient py-3 px-5 rounded-lg">
				<div className="flex space-x-5 text-black font-normal text-xs">
					<img
						src={userData?.avatar ?? Rectangle}
						alt="avatar"
						className="w-20 h-20 rounded-lg object-cover"
					/>

					<div className="flex flex-col gap-1">
						<h2 className="text-mainPurple font-bold text-base">
							{userData?.full_name ?? "Неизвестно"}
						</h2>
						<span>{userData?.role ?? "Роль неизвестна"}</span>
						<span>{userData?.department ?? "Отдел неизвестен"}</span>
					</div>
				</div>
			</div>
			<div className="relative w-full px-9">
				<Left
					className="absolute -left-1 top-1/2 w-9 h-9 cursor-pointer"
					onClick={onLeftClick}
				/>
				<div className=" h-[296px] bg-gray-700 rounded-xl mt-4"></div>
				<Right
					className="absolute -right-1 top-1/2 w-9 h-9 cursor-pointer"
					onClick={onRightClick}
				/>
			</div>
			<div className="flex gap-5 mt-5 flex-wrap justify-center">
				<StatWidget />
				<StatWidget />
			</div>
		</div>
	);
};

export default SecretaryCarousel;
