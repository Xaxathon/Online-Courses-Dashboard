import { useState, useEffect, useRef, useCallback } from "react";

import { ReactComponent as Spinner } from "@assets/icons/spinner.svg";

import Skeleton from "../skeleton/Skeleton";
import ProtocolTaskItem from "../protocolTaskItem/ProtocolTaskItem";

import { useGetProtocolTasksQuery } from "@/api/protocolsApi";

import { ProtocolTask } from "@/shared/interfaces/protocol";

const DEFAULT_LIMIT = 15;
const MIN_TASKS_TO_SHOW_MESSAGE = 15;

interface TaskListProps {
	searchTerm: string;
}

const ProtocolTaskList: React.FC<TaskListProps> = ({ searchTerm }) => {
	const [page, setPage] = useState(1);
	const [allTasks, setAllTasks] = useState<ProtocolTask[]>([]);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	const { data, error, isLoading, isFetching, refetch } =
		useGetProtocolTasksQuery(
			{
				limit: DEFAULT_LIMIT,
				page: page,
				search: searchTerm,
			},
			{
				skip: false,
			}
		);

	const observer = useRef<IntersectionObserver | null>(null);

	const lastTaskElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isFetching) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					!isFetching &&
					data?.data?.data.length === DEFAULT_LIMIT
				) {
					setPage((prevPage) => prevPage + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[isFetching, data]
	);

	useEffect(() => {
		setPage(1);
		setAllTasks([]);
		refetch();
	}, [searchTerm, refetch]);

	useEffect(() => {
		if (data?.data?.data) {
			setAllTasks((prevTasks) => {
				const newTasks = data.data.data;
				if (page === 1) {
					return newTasks;
				} else {
					const uniqueNewTasks = newTasks.filter(
						(newTask) =>
							!prevTasks.some((prevTask) => prevTask.id === newTask.id)
					);
					return [...prevTasks, ...uniqueNewTasks];
				}
			});
		}
	}, [data, page]);

	useEffect(() => {
		if (!isLoading && !isFetching) {
			setInitialLoadComplete(true);
		}
	}, [isLoading, isFetching]);

	const handleDeleteTask = (taskId: number) => {
		setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
	};

	const handleUpdateTaskStatus = (taskId: number, newStatus: string) => {
		setAllTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId ? { ...task, status: newStatus } : task
			)
		);
	};
	if (isLoading && allTasks.length === 0)
		return (
			<div className="h-[78vh] overflow-y-auto rounded-lg">
				<SkeletonTaskItem />
				<SkeletonTaskItem />
				<SkeletonTaskItem />
				<SkeletonTaskItem />
				<SkeletonTaskItem />
				<SkeletonTaskItem />
				<SkeletonTaskItem />
				<SkeletonTaskItem />
			</div>
		);
	if (error) return <div>Ошибка загрузки задач</div>;
	if (allTasks.length === 0)
		return (
			<div className="text-center font-bold text-gardenGreen mt-5">
				Задачи не найдены
			</div>
		);

	const showNoMoreTasksMessage =
		!isFetching &&
		initialLoadComplete &&
		allTasks.length >= MIN_TASKS_TO_SHOW_MESSAGE &&
		(data?.data?.data.length ?? 0) < DEFAULT_LIMIT;

	return (
		<div className="h-[78vh] overflow-y-auto rounded-lg ">
			{allTasks.map((task, index) => (
				<ProtocolTaskItem
					ref={allTasks.length === index + 1 ? lastTaskElementRef : null}
					key={`${task.id}-${index}`}
					task={task}
					onDelete={handleDeleteTask}
					onUpdate={handleUpdateTaskStatus}
				/>
			))}
			{isFetching && (
				<div className="flex justify-center mt-2">
					<Spinner />
				</div>
			)}
			{showNoMoreTasksMessage && (
				<div className="text-center font-bold text-mainPurple">Пусто</div>
			)}
		</div>
	);
};

export default ProtocolTaskList;

const SkeletonTaskItem = () => {
	return (
		<div className="flex bg-gray-100 w-full p-4 mb-5 rounded-lg gap-2">
			<Skeleton width="1/4" height="7" className="mb-2 rounded" />
			<Skeleton width="1/4" height="7" className="mb-2 rounded" />
			<Skeleton width="1/4" height="7" className="mb-2 rounded" />
			<Skeleton width="1/4" height="7" className="mb-2 rounded" />
		</div>
	);
};
