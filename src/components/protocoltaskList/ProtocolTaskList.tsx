import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";
import Skeleton from "../skeleton/Skeleton";
import ProtocolTaskItem from "../protocolTaskItem/ProtocolTaskItem";
import { useGetProtocolTasksQuery } from "@/api/protocolsApi";
import { ProtocolTask } from "@/shared/interfaces/protocol";

const ProtocolTaskList = ({ searchTerm }: { searchTerm: string }) => {
	const [page, setPage] = useState(1);
	const [allTasks, setAllTasks] = useState<ProtocolTask[]>([]);

	const { data, error, isLoading, isFetching } = useGetProtocolTasksQuery(
		{
			limit: Number(import.meta.env.VITE_DEFAULT_PAGINATION_LIMIT) || 15,
			page,
			search: searchTerm,
		},
		{ skip: false }
	);

	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (data?.data?.data) {
			setAllTasks((prevTasks) => {
				const newTasks = data.data.data;
				if (page === 1) return newTasks;
				const uniqueNewTasks = newTasks.filter(
					(newTask) => !prevTasks.some((prevTask) => prevTask.id === newTask.id)
				);
				return [...prevTasks, ...uniqueNewTasks];
			});
		}
	}, [data, page, isLoading, isFetching]);

	const lastTaskElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching || !node) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					data?.data?.data.length ===
						(Number(import.meta.env.VITE_DEFAULT_PAGINATION_LIMIT) || 15)
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});
			observer.current.observe(node);
		},
		[isFetching, data?.data?.data.length]
	);

	return (
		<div className="overflow-y-auto rounded-lg mb-3">
			{allTasks.map((task, index) => (
				<ProtocolTaskItem
					ref={allTasks.length === index + 1 ? lastTaskElementRef : null}
					key={task.id}
					task={task}
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
							Ошибка загрузки задач
						</span>
					) : (
						allTasks.length === 0 && (
							<span className="block text-center text-gardenGreen font-bold mt-5">
								На данный момент нет задач
							</span>
						)
					)}
				</>
			)}
		</div>
	);
};
export default ProtocolTaskList;

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
