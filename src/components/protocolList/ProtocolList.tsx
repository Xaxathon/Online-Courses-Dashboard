import {
	useState,
	useEffect,
	useRef,
	useCallback,
	Fragment,
	forwardRef,
} from "react";

import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

import ProtocolItem from "../protocolItem/ProtocolItem";
import Skeleton from "../skeleton/Skeleton";

import { useGetProtocolsQuery } from "@/api/protocolsApi";

import { Protocol } from "@/shared/interfaces/protocol";

const DEFAULT_LIMIT = 15;
const MIN_PROTOCOLS_TO_SHOW_MESSAGE = 15;

const ProtocolList: React.FC = () => {
	const [page, setPage] = useState(1);
	const [allProtocols, setAllProtocols] = useState<Protocol[]>([]);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const { data, error, isLoading, isFetching } = useGetProtocolsQuery(
		{
			limit: DEFAULT_LIMIT,
			page: page,
		},
		{
			skip: false,
		}
	);

	const observer = useRef<IntersectionObserver | null>(null);

	const lastProtocolElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					!isFetching &&
					data?.data &&
					data.data.length === DEFAULT_LIMIT
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, data]
	);

	useEffect(() => {
		if (data?.data) {
			setAllProtocols((prevProtocols) => {
				const newProtocols = data.data;
				if (page === 1) {
					return newProtocols;
				} else {
					const uniqueNewProtocols = newProtocols.filter(
						(newProtocol) =>
							!prevProtocols.some(
								(prevProtocol) => prevProtocol.id === newProtocol.id
							)
					);
					return [...prevProtocols, ...uniqueNewProtocols];
				}
			});
		}
	}, [data, page]);

	useEffect(() => {
		if (!isLoading && !isFetching) {
			setInitialLoadComplete(true);
		}
	}, [isLoading, isFetching]);

	if (isLoading && allProtocols.length === 0)
		return (
			<div className="h-[78vh] overflow-y-auto rounded-lg">
				<SkeletonProtocolItem />
				<SkeletonProtocolItem />
				<SkeletonProtocolItem />
				<SkeletonProtocolItem />
				<SkeletonProtocolItem />
				<SkeletonProtocolItem />
			</div>
		);
	if (error) return <div>Ошибка загрузки протоколов</div>;

	if (allProtocols.length === 0) return <div>Протоколы не найдены</div>;

	const showNoMoreProtocolsMessage =
		!isFetching &&
		initialLoadComplete &&
		allProtocols.length >= MIN_PROTOCOLS_TO_SHOW_MESSAGE &&
		data?.data &&
		data.data.length < DEFAULT_LIMIT;

	const protocolsBySecretary = allProtocols.reduce((acc, protocol) => {
		const secretaryId = protocol.secretary.id;
		if (!acc[secretaryId]) {
			acc[secretaryId] = [];
		}
		acc[secretaryId].push(protocol);
		return acc;
	}, {} as { [key: number]: Protocol[] });

	return (
		<div className="h-[78vh] overflow-y-auto rounded-lg">
			{Object.entries(protocolsBySecretary).map(([secretaryId, protocols]) => (
				<Fragment key={secretaryId}>
					{protocols.map((protocol, index) => (
						<ProtocolItem
							ref={
								allProtocols.length === index + 1
									? lastProtocolElementRef
									: null
							}
							key={`${protocol.id}-${index}`}
							protocol={protocol}
							localNumber={index + 1}
						/>
					))}
				</Fragment>
			))}
			{isFetching && (
				<div className="flex justify-center mt-2">
					<Spinner />
				</div>
			)}
			{showNoMoreProtocolsMessage && (
				<div className="text-center mt-4 text-mainPurple">
					Больше нет протоколов для загрузки
				</div>
			)}
		</div>
	);
};

export default ProtocolList;

const SkeletonProtocolItem = () => {
	return (
		<li className="flex bg-gray-100 px-5 py-6 rounded-lg gap-3  my-3">
			<Skeleton width="1/2" height="10" className="mb-2 rounded-lg" />
			<Skeleton width="10" height="10" className="mb-2 rounded-lg" />
			<Skeleton width="20" height="10" className="mb-2 rounded-lg" />
			<Skeleton width="1/2" height="10" className="mb-2 rounded-lg" />
		</li>
	);
};
