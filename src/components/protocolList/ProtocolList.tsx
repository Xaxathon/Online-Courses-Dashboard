import { useEffect, useCallback, useState, useRef } from "react";

import ProtocolItem from "../protocolItem/ProtocolItem";
import { showNotification } from "@/store/slices/notificationSlice";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";
import Skeleton from "../skeleton/Skeleton";

import { useDispatch } from "react-redux";

import { listenToProtocolUpdates } from "@/api/echo";
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
			const unsubscribe = listenToProtocolUpdates(id, updateProtocolInList);

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

	const updateProtocolInList = (updatedProtocol: Protocol) => {
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
	};

	return (
		<div className="h-[78vh] overflow-y-auto rounded-lg relative">
			{allProtocols.map((protocol, index) => (
				<ProtocolItem
					ref={
						allProtocols.length === index + 1 ? lastProtocolElementRef : null
					}
					key={`${protocol.id}-${index}`}
					protocol={protocol}
				/>
			))}

			{isLoading && (
				<div className="h-[78vh] overflow-y-auto rounded-lg">
					<SkeletonProtocolItem />
					<SkeletonProtocolItem />
					<SkeletonProtocolItem />
					<SkeletonProtocolItem />
					<SkeletonProtocolItem />
					<SkeletonProtocolItem />
				</div>
			)}
			{isFetching && (
				<div className="flex justify-center mt-2">
					<Spinner />
				</div>
			)}
			{error && (
				<span className="block text-center text-crimsonRed font-bold mt-5">
					Ошибка загрузки протоколов
				</span>
			)}
			{allProtocols.length === 0 && (
				<span className="block text-center text-gardenGreen font-bold mt-5">
					На данный момент нет протоколов
				</span>
			)}
		</div>
	);
};

export default ProtocolList;

const SkeletonProtocolItem = () => {
	return (
		<li className="flex bg-gray-100 px-5 py-6 rounded-lg gap-3  my-3">
			<Skeleton width="full" height="10" className="mb-2 rounded-lg" />
		</li>
	);
};
