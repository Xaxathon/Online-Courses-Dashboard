import { useEffect, useCallback, useState, useRef, useMemo } from "react";

import ProtocolItem from "../protocolItem/ProtocolItem";
import { showNotification } from "@/store/slices/notificationSlice";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";
import Skeleton from "../skeleton/Skeleton";

import { useDispatch } from "react-redux";

import { echoService } from "@/api/echo";
import {
	useGetProtocolsQuery,
	useProcessVideoMutation,
} from "@/api/protocolsApi";

import { Protocol, ProtocolStage } from "@/shared/interfaces/protocol";

const ProtocolList = () => {
	const dispatch = useDispatch();

	const [page, setPage] = useState(1);
	const [allProtocols, setAllProtocols] = useState<Protocol[]>([]);

	const { data, error, isLoading, isFetching } = useGetProtocolsQuery(
		{
			limit: Number(import.meta.env.VITE_DEFAULT_PAGINATION_LIMIT) || 15,
			page: page,
		},
		{
			skip: false,
		}
	);
	const [processVideo] = useProcessVideoMutation();

	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (data?.data) {
			setAllProtocols((prevProtocols) => {
				const newProtocols = data.data;
				if (page === 1) {
					return newProtocols;
				} else {
					return [
						...prevProtocols,
						...newProtocols.filter(
							(newProtocol) =>
								!prevProtocols.some(
									(prevProtocol) => prevProtocol.id === newProtocol.id
								)
						),
					];
				}
			});

			data.data.forEach((protocol) => {
				if (protocol.stage === ProtocolStage.VideoProcess) {
					handleProcessVideo(protocol.id);
				}
			});
		}
	}, [data, page]);

	useEffect(() => {
		if (data?.data) {
			data.data.forEach((protocol) => {
				if (protocol.stage === ProtocolStage.VideoProcess) {
					handleProcessVideo(protocol.id);
				}
			});
		}
	}, [data]);

	const handleProcessVideo = async (id: number) => {
		try {
			await processVideo(id).unwrap();
			const unsubscribe = echoService.listenToProtocolUpdates(
				id,
				updateProtocolInList
			);

			setTimeout(() => {
				unsubscribe();
			}, 5 * 60 * 1000);
		} catch (error) {
			console.error("Ошибка при начале обработки видео:", error);
			dispatch(showNotification({ message: "Ошибка при обработке видео" }));
		}
	};

	const lastProtocolElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					!isFetching &&
					data?.data &&
					data.data.length ===
						(Number(import.meta.env.VITE_DEFAULT_PAGINATION_LIMIT) || 15)
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, data]
	);

	const updateProtocolInList = useCallback(
		(updatedProtocol: Protocol) => {
			setAllProtocols((prevProtocols) =>
				prevProtocols.map((protocol) =>
					protocol.id === updatedProtocol.id ? updatedProtocol : protocol
				)
			);

			dispatch(
				showNotification({
					message: `Протокол №${updatedProtocol.protocol_number} готов, нажмите на это сообщение, чтобы открыть его.`,
					protocolId: updatedProtocol.id,
				})
			);

			dispatch({
				type: "protocolsApi/invalidateTags",
				payload: [{ type: "Protocol", id: "LIST" }],
			});

			if (updatedProtocol.stage !== ProtocolStage.VideoProcess) {
				echoService.stopListeningToProtocol(updatedProtocol.id);
			}
		},
		[dispatch]
	);

	return (
		<div className="h-full overflow-y-auto rounded-lg relative">
			{allProtocols.map((protocol, index) => (
				<ProtocolItem
					ref={
						allProtocols.length === index + 1 ? lastProtocolElementRef : null
					}
					key={`${protocol.id}-${index}`}
					protocol={protocol}
				/>
			))}

			{isLoading && <SkeletonList />}
			{!isLoading && (
				<>
					{isFetching && (
						<div className="flex justify-center mt-2">
							<Spinner />
						</div>
					)}
					{error ? (
						<span className="block text-center text-crimsonRed font-bold mt-5">
							Ошибка загрузки протоколов
						</span>
					) : (
						allProtocols.length === 0 && (
							<span className="block text-center text-gardenGreen font-bold mt-5">
								На данный момент нет протоколов
							</span>
						)
					)}
				</>
			)}
		</div>
	);
};

export default ProtocolList;

const SkeletonList = () => {
	const skeletonItems = useMemo(() => {
		return Array(10)
			.fill(null)
			.map((_, index) => (
				<div
					key={`skeleton-${index}`}
					className="flex bg-gray-100 w-full p-4 mb-5 rounded-lg gap-2"
				>
					<Skeleton width="1/4" height="7" className="mb-2 rounded" />
					<Skeleton width="1/4" height="7" className="mb-2 rounded" />
					<Skeleton width="1/4" height="7" className="mb-2 rounded" />
					<Skeleton width="1/4" height="7" className="mb-2 rounded" />
				</div>
			));
	}, []);

	return <>{skeletonItems}</>;
};
