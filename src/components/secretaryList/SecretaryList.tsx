import { memo } from "react";

import SecretaryItem from "../secretaryItem/SecretaryItem";
import Skeleton from "../skeleton/Skeleton";

import { User } from "../../shared/interfaces/user";

interface SecretaryListProps {
	secretaries: User[];
	selectedSecretaryId: number | null;
	onSecretarySelect: (id: number) => void;
	isLoading: boolean;
	lastSecretaryElementRef: (node: HTMLElement | null) => void;
}

const SecretaryList = memo(
	({
		secretaries,
		onSecretarySelect,
		selectedSecretaryId,
		isLoading,
		lastSecretaryElementRef,
	}: SecretaryListProps) => {
		return (
			<ul className="flex flex-col gap-3 overflow-y-auto h-[76vh]">
				{secretaries.map((secretary, index) => (
					<SecretaryItem
						key={secretary.id}
						fullName={secretary.full_name}
						isActive={secretary.id === selectedSecretaryId}
						onClick={() => onSecretarySelect(secretary.id as number)}
						ref={
							index === secretaries.length - 1 ? lastSecretaryElementRef : null
						}
					/>
				))}
				{isLoading && (
					<div className="flex flex-col gap-3 overflow-y-auto h-[80vh]">
						<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
						<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
						<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
						<Skeleton width="3/4" height="20" className="rounded-md mt-1" />
					</div>
				)}
				{secretaries.length === 0 && (
					<span className="block mx-auto text-center text-gardenGreen font-bold">
						На данный момент нет секретарей
					</span>
				)}
			</ul>
		);
	}
);

export default SecretaryList;
