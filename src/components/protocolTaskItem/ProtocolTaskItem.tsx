import { forwardRef, useState, memo, ChangeEvent } from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import classNames from "classnames";

import { ReactComponent as Delete } from "@assets/icons/delete.svg";

import DeleteElementModal from "../deleteElementModal/DeleteElementModal";

import {
	useDeleteProtocolTaskMutation,
	useUpdateProtocolTaskMutation,
} from "@/api/protocolsApi";

import { ProtocolTask } from "@/shared/interfaces/protocol";

interface TaskItemProps {
	task: ProtocolTask;
	onDelete: (taskId: number) => void;
}

const getStatusColor = (status: string) => {
	switch (status) {
		case "expired":
			return "text-crimsonRed";
		case "success":
			return "text-gardenGreen";
		case "process":
			return "text-mainPurple";
		default:
			return "text-black";
	}
};

const ProtocolTaskItem = memo(
	forwardRef<HTMLUListElement, TaskItemProps>(({ task, onDelete }, ref) => {
		const navigate = useNavigate();

		const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
		const [currentStatus, setCurrentStatus] = useState(task.status);

		const [deleteProtocolTask] = useDeleteProtocolTaskMutation();
		const [updateProtocolTask, { isLoading: isUpdateTaskLoading }] =
			useUpdateProtocolTaskMutation();

		const formattedDate = dayjs(task.deadline).format("DD.MM.YYYY");

		const handleStatusChange = async (e: ChangeEvent<HTMLSelectElement>) => {
			const newStatus = e.target.value;
			setCurrentStatus(newStatus);

			try {
				await updateProtocolTask({
					taskId: task.id,
					status: newStatus,
				}).unwrap();
			} catch (error) {
				console.error("Error updating task status:", error);
				setCurrentStatus(task.status);
			}
		};

		const handleDelete = async () => {
			try {
				await deleteProtocolTask({ taskId: task.id });
				onDelete(task.id);
			} catch (error) {
				console.error("Error deleting task:", error);
			}
		};

		return (
			<>
				<ul
					ref={ref}
					className="relative grid grid-cols-5 xl:text-sm text-xs bg-gray-100 items-center justify-center rounded-lg text-center p-4 w-full mb-3 cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
					onClick={() => navigate(`/main/protocols/${task.protocol.id}`)}
				>
					<li
						className={classNames(
							getStatusColor(currentStatus),
							"bg-transparent",
							"border-none",
							"transition-all",
							"text-start",
							"duration-300",
							{ "opacity-50": isUpdateTaskLoading }
						)}
					>
						{task.essence}
					</li>
					<li
						className={classNames(
							getStatusColor(currentStatus),
							"bg-transparent",
							"border-none",
							"transition-all",
							"duration-300",
							{ "opacity-50": isUpdateTaskLoading }
						)}
					>
						{task.protocol.director.full_name}
					</li>
					<li
						className={classNames(
							getStatusColor(currentStatus),
							"bg-transparent",
							"border-none",
							"transition-all",
							"duration-300",
							{ "opacity-50": isUpdateTaskLoading }
						)}
					>
						{formattedDate}
					</li>
					<li className="col-span-1" onClick={(e) => e.stopPropagation()}>
						<select
							value={currentStatus}
							onChange={handleStatusChange}
							className={classNames(
								getStatusColor(currentStatus),
								"bg-transparent",
								"border-none",
								"cursor-pointer",
								"transition-all",
								"duration-300",
								{ "opacity-50": isUpdateTaskLoading }
							)}
							disabled={isUpdateTaskLoading}
						>
							<option value="process">В процессе</option>
							<option value="success">Выполнено</option>
							<option value="expired">Просрочено</option>
						</select>
					</li>
					<li className="col-span-1 flex justify-center">
						<span className="text-black font-bold xl:border-2 border rounded-lg border-gardenGreen px-5 py-2 flex items-center justify-center">
							{task.protocol.protocol_number}
						</span>
					</li>
					<li
						className="absolute right-2 top-1/2 translate-y-[-50%]"
						onClick={(e) => e.stopPropagation()}
					>
						<Delete
							className="xl:w-7 xl:h-7 h-5 w-5 fill-current text-gray-500 hover:text-crimsonRed active:text-crimsonRedHover cursor-pointer"
							onClick={() => setIsDeleteModalOpen(true)}
						/>
					</li>
				</ul>
				{isDeleteModalOpen && (
					<DeleteElementModal
						onClose={() => setIsDeleteModalOpen(false)}
						onDelete={handleDelete}
						title="Удаление задачи протокола"
						description={`Задача: ${task.essence.slice(0, 10)} для протокола №${
							task.protocol.id
						}`}
					/>
				)}
			</>
		);
	})
);

export default ProtocolTaskItem;
