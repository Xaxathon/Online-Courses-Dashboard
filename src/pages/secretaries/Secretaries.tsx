import { useCallback, useEffect, useState, useRef } from "react";

import { ReactComponent as Search } from "@assets/icons/search.svg";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

import SecretaryList from "@components/secretaryList/SecretaryList";
import SecretaryCarousel from "@components/secretaryCarousel/SecretaryCarousel";
import Skeleton from "@components/skeleton/Skeleton";

import {
	getPreviousSecretaryId,
	getNextSecretaryId,
	filterInternalUsers,
} from "@/utils/secretaryCarousel";

import { useFetchManagerStatsQuery } from "@/api/statsApi";
import {
	useFetchUsersQuery,
	useLazyFetchUserQuery,
	useFetchUserByIdQuery,
} from "@/api/authApi";

import { BaseUser, User } from "@/shared/interfaces/user";

const DEFAULT_LIMIT = 15;
const MIN_SECRETARIES_TO_SHOW_MESSAGE = 15;
const SEARCH_DELAY = 500;

const Secretaries: React.FC = () => {
	const [selectedSecretaryId, setSelectedSecretaryId] = useState<number | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [allSecretaries, setAllSecretaries] = useState<User[]>([]);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [fetchUser, { data: userData, isLoading: isUserLoading }] =
		useLazyFetchUserQuery();
	const { data: managerStats } = useFetchManagerStatsQuery();

	const {
		data: secretaryData,
		isLoading: isSecretaryLoading,
		refetch: refetchSecretary,
	} = useFetchUserByIdQuery(selectedSecretaryId!, {
		skip: selectedSecretaryId === null,
	});

	const {
		data: secretariesData,
		isLoading: isSecretariesLoading,
		isFetching,
	} = useFetchUsersQuery({
		limit: searchTerm ? undefined : DEFAULT_LIMIT,
		page: searchTerm ? undefined : page,
		search: searchTerm,
	});

	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	useEffect(() => {
		if (selectedSecretaryId !== null) {
			setLoading(true);
			refetchSecretary().finally(() => setLoading(false));
		}
	}, [selectedSecretaryId, refetchSecretary]);

	useEffect(() => {
		if (secretariesData?.data?.data) {
			setAllSecretaries((prevSecretaries) => {
				const newSecretaries = Array.isArray(secretariesData.data.data)
					? secretariesData.data.data
					: [secretariesData.data.data];
				if (searchTerm || page === 1) {
					return newSecretaries;
				} else {
					const uniqueNewSecretaries = newSecretaries.filter(
						(newSecretary) =>
							!prevSecretaries.some(
								(prevSecretary) => prevSecretary.id === newSecretary.id
							)
					);
					return [...prevSecretaries, ...uniqueNewSecretaries];
				}
			});
		}
	}, [secretariesData, page, searchTerm]);

	useEffect(() => {
		if (!isSecretariesLoading && !isFetching) {
			setInitialLoadComplete(true);
		}
	}, [isSecretariesLoading, isFetching]);

	const handleSecretarySelect = (id: number) => {
		setSelectedSecretaryId(id);
	};

	const handleNavigation = useCallback(
		(direction: "left" | "right") => {
			if (selectedSecretaryId !== null && allSecretaries.length > 0) {
				const internalSecretaries = filterInternalUsers(allSecretaries);
				const secretaryId =
					direction === "left"
						? getPreviousSecretaryId(internalSecretaries, selectedSecretaryId)
						: getNextSecretaryId(internalSecretaries, selectedSecretaryId);
				if (secretaryId !== null) {
					setSelectedSecretaryId(secretaryId);
				}
			}
		},
		[selectedSecretaryId, allSecretaries]
	);

	const handleLeftClick = () => handleNavigation("left");
	const handleRightClick = () => handleNavigation("right");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchInput(value);
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			setSearchTerm(value);
			setPage(1);
		}, SEARCH_DELAY);
	};

	const lastSecretaryElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					!isFetching &&
					!searchTerm &&
					Array.isArray(secretariesData?.data?.data) &&
					secretariesData.data.data.length === DEFAULT_LIMIT
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, secretariesData, searchTerm]
	);

	const showNoMoreSecretariesMessage =
		!isFetching &&
		initialLoadComplete &&
		allSecretaries.length >= MIN_SECRETARIES_TO_SHOW_MESSAGE &&
		!searchTerm &&
		(Array.isArray(secretariesData?.data?.data)
			? secretariesData.data.data.length
			: 0) < DEFAULT_LIMIT;

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
							userData={secretaryData?.data as BaseUser | undefined}
							isLoading={loading || isSecretaryLoading}
							onLeftClick={handleLeftClick}
							onRightClick={handleRightClick}
						/>
					)}
				</div>
				<div className="">
					<div className="flex justify-center items-center w-full bg-gray-100 mt-2 rounded-lg px-3 py-1 mb-5">
						<input
							className="bg-transparent p-2 w-full focus:outline-none"
							type="text"
							placeholder="Введите запрос"
							value={searchInput}
							onChange={handleSearchChange}
						/>
						{isFetching && searchTerm === searchInput ? (
							<Spinner className="w-6 h-6 animate-spin" />
						) : (
							<Search className="w-6 h-6" />
						)}
					</div>
					<SecretaryList
						secretaries={allSecretaries}
						selectedSecretaryId={selectedSecretaryId}
						onSecretarySelect={handleSecretarySelect}
						isLoading={isSecretariesLoading || isFetching}
						lastSecretaryElementRef={lastSecretaryElementRef}
					/>
					{showNoMoreSecretariesMessage && (
						<div className="text-center mt-4 text-mainPurple">
							Больше нет секретарей для загрузки
						</div>
					)}
				</div>
			</div>
			<div className="flex justify-center font-bold text-lg gap-32 mb-4 ">
				<div className="flex flex-col">
					<span className="text-center">Протоколы</span>
					<div className="flex justify-center items-center mt-1 gap-3">
						<span className="text-mainPurple">
							{managerStats?.data.protocols.in_process}
						</span>
						<span className="text-gardenGreen">
							{managerStats?.data.protocols.success}
						</span>
					</div>
				</div>
				<div className="flex flex-col">
					<span className="text-center">Задачи</span>
					<div className="flex justify-center items-center mt-1 gap-5">
						<span className="text-mainPurple">
							{managerStats?.data.tasks.process}
						</span>
						<span className="text-crimsonRed">
							{managerStats?.data.tasks.expired}
						</span>
						<span className="text-gardenGreen">
							{managerStats?.data.tasks.success}
						</span>
					</div>
				</div>
				<div className="flex flex-col">
					<span className="text-center">Совещания</span>
					<div className="flex justify-center items-center mt-1 gap-3">
						<span className="text-mainPurple">
							{managerStats?.data.meetings.in_process}
						</span>
						<span className="text-gardenGreenHover">
							{managerStats?.data.meetings.success}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Secretaries;
