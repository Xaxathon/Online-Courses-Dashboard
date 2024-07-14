import SecretaryItem from "../secretaryItem/SecretaryItem";
import { User } from "../../shared/interfaces/user";
import Skeleton from "../skeleton/Skeleton";
import { memo } from "react";

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
		if (isLoading && secretaries.length === 0) {
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

		console.log("Protocols:");
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
			</ul>
		);
	}
);

export default SecretaryList;
