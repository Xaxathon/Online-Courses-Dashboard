import React from "react";
import SecretaryItem from "../secretaryItem/SecretaryItem";
import { User } from "../../shared/interfaces/user";
import Skeleton from "../skeleton/Skeleton";

interface SecretaryListProps {
	secretaries: User[];
	selectedSecretaryId: number | null;
	onSecretarySelect: (id: number) => void;
	isLoading: boolean;
}

const SecretaryList = ({
	secretaries,
	onSecretarySelect,
	selectedSecretaryId,
	isLoading,
}: SecretaryListProps) => {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-3 overflow-y-auto h-[80vh]">
				<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
				<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
				<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
				<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
			</div>
		);
	}

	if (secretaries.length === 0) {
		return (
			<span className="flex items-center justify-center text-mainPurple">
				Нет секретарей
			</span>
		);
	}
	return (
		<ul className="flex flex-col gap-3 overflow-y-auto h-[80vh]">
			{secretaries.map((secretary) => (
				<SecretaryItem
					key={secretary.id}
					fullName={secretary.full_name}
					isActive={secretary.id === selectedSecretaryId}
					onClick={() => onSecretarySelect(secretary.id as number)}
				/>
			))}
		</ul>
	);
};

export default SecretaryList;
