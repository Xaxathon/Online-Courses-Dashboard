import { useCallback, useEffect, useState } from "react";
import SecretaryList from "../../components/secretaryList/SecretaryList";

import { ReactComponent as Search } from "@assets/icons/search.svg";
import Skeleton from "../../components/skeleton/Skeleton";
import {
	useFetchUsersQuery,
	useLazyFetchUserQuery,
	useFetchUserByIdQuery,
} from "../../api/authApi";
import {
	getPreviousSecretaryId,
	getNextSecretaryId,
	filterInternalUsers,
} from "../../utils/secretaryCarousel";

import SecretaryCarousel from "../../components/secretaryCarousel/SecretaryCarousel";

const Secretaries = () => {
	const [selectedSecretaryId, setSelectedSecretaryId] = useState<number | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);

	const [fetchUser, { data: userData, isLoading: isUserLoading }] =
		useLazyFetchUserQuery();

	const {
		data: secretaryData,
		isLoading: isSecretaryLoading,
		refetch,
	} = useFetchUserByIdQuery(selectedSecretaryId!, {
		skip: selectedSecretaryId === null,
	});

	const { data: secretariesData, isLoading: isSecretariesLoading } =
		useFetchUsersQuery();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	useEffect(() => {
		if (selectedSecretaryId !== null) {
			setLoading(true);
			refetch().finally(() => setLoading(false));
		}
	}, [selectedSecretaryId, refetch]);

	const handleSecretarySelect = (id: number) => {
		setSelectedSecretaryId(id);
	};

	const handleNavigation = useCallback(
		(direction: "left" | "right") => {
			if (selectedSecretaryId !== null && secretariesData) {
				const internalSecretaries = filterInternalUsers(
					secretariesData.data.data
				);
				const secretaryId =
					direction === "left"
						? getPreviousSecretaryId(internalSecretaries, selectedSecretaryId)
						: getNextSecretaryId(internalSecretaries, selectedSecretaryId);
				if (secretaryId !== null) {
					setSelectedSecretaryId(secretaryId);
				}
			}
		},
		[selectedSecretaryId, secretariesData]
	);

	const handleLeftClick = () => handleNavigation("left");
	const handleRightClick = () => handleNavigation("right");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setIsSearching(true);

		setTimeout(() => {
			setIsSearching(false);
		}, 500);
	};

	const filteredSecretaries =
		secretariesData?.data?.data.filter((secretary) =>
			secretary.full_name.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];
	console.log(secretaryData);
	return (
		<div className="mx-4 mt-7 w-full">
			<div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
				<div>
					<div className="flex justify-between gap-10 items-center mb-4">
						<div className="flex items-center w-full gap-3 xl:text-xl lg:text-lg text-sm text-mainPurple bg-gray-100 py-4 px-5 rounded-lg">
							<span className="">Дашборд менеджера: </span>
							{isUserLoading && (
								<Skeleton width="1/2" height="6" className="rounded-lg" />
							)}
							<span className="font-bold">{userData?.data.full_name}</span>
						</div>
					</div>
					{selectedSecretaryId === null ? (
						<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5">
							<Skeleton width="20" height="20" className="rounded-lg mb-4" />
							<Skeleton width="3/4" height="6" className="mb-2" />
							<Skeleton width="1/2" height="4" className="mb-2" />
							<Skeleton width="1/2" height="4" />
						</div>
					) : (
						<SecretaryCarousel
							userData={secretaryData?.data}
							isLoading={loading || isSecretaryLoading}
							onLeftClick={handleLeftClick}
							onRightClick={handleRightClick}
						/>
					)}
				</div>
				<div>
					<div className="flex justify-center items-center w-full bg-gray-100 mt-2 rounded-lg px-3 py-1 mb-5">
						<input
							className="bg-transparent p-2 w-full focus:outline-none"
							type="text"
							placeholder="Введите запрос"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<Search className="w-6 h-6" />
					</div>
					<SecretaryList
						secretaries={filteredSecretaries}
						selectedSecretaryId={selectedSecretaryId}
						onSecretarySelect={handleSecretarySelect}
						isLoading={isSecretariesLoading || isSearching}
					/>
				</div>
			</div>
		</div>
	);
};

export default Secretaries;
