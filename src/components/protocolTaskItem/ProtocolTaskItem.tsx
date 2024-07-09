import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
	onUpdate: (taskId: number, newStatus: string) => void;
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
const ProtocolTaskItem = forwardRef<HTMLUListElement, TaskItemProps>(
	({ task, onDelete, onUpdate }, ref) => {
		const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
		const [deleteProtocolTask] = useDeleteProtocolTaskMutation();
		const [updateProtocolTask] = useUpdateProtocolTaskMutation();
		const [currentStatus, setCurrentStatus] = useState(task.status);
		const [isUpdating, setIsUpdating] = useState(false);
		const [updateMessage, setUpdateMessage] = useState("");
		const navigate = useNavigate();

		const handleDeleteClick = () => {
			setIsDeleteModalOpen(true);
		};

		const handleCloseModal = () => {
			setIsDeleteModalOpen(false);
		};

		const handleDelete = async () => {
			try {
				await deleteProtocolTask({ taskId: task.id });
				onDelete(task.id);
				setIsDeleteModalOpen(false);
			} catch (error) {
				console.error("Error deleting task:", error);
				setUpdateMessage("Ошибка при удалении задачи");
			}
		};

		const handleStatusChange = async (
			e: React.ChangeEvent<HTMLSelectElement>
		) => {
			const newStatus = e.target.value;
			setIsUpdating(true);
			setCurrentStatus(newStatus);

			try {
				await updateProtocolTask({
					taskId: task.id,
					status: newStatus,
				}).unwrap();
			} catch (error) {
				console.error("Error updating task status:", error);
				setCurrentStatus(task.status);
			} finally {
				setIsUpdating(false);
				setTimeout(() => setUpdateMessage(""), 3000);
			}
		};

		const handleItemClick = () => {
			navigate(`/main/protocols/${task.protocol.id}`);
		};

		return (
			<>
				<ul
					ref={ref}
					className="relative grid grid-cols-5 xl:text-sm text-xs bg-gray-100 items-center justify-center rounded-lg text-center p-4 w-full mb-3 cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
					onClick={handleItemClick}
				>
					<li
						className={`${getStatusColor(
							currentStatus
						)} bg-transparent border-none transition-all text-start duration-300 ${
							isUpdating ? "opacity-50" : ""
						}`}
					>
						{task.essence}
					</li>
					<li
						className={`${getStatusColor(
							currentStatus
						)} bg-transparent border-none transition-all duration-300 ${
							isUpdating ? "opacity-50" : ""
						}`}
					>
						{task.protocol.director.full_name}
					</li>
					<li
						className={`${getStatusColor(
							currentStatus
						)} bg-transparent border-none transition-all duration-300 ${
							isUpdating ? "opacity-50" : ""
						}`}
					>
						{task.deadline}
					</li>
					<li className="col-span-1" onClick={(e) => e.stopPropagation()}>
						<select
							value={currentStatus}
							onChange={handleStatusChange}
							className={`${getStatusColor(
								currentStatus
							)} bg-transparent border-none cursor-pointer transition-all duration-300 ${
								isUpdating ? "opacity-50" : ""
							}`}
							disabled={isUpdating}
						>
							<option value="process">В процессе</option>
							<option value="success">Выполнено</option>
							<option value="expired">Просрочено</option>
						</select>
						{updateMessage && (
							<span
								className={`ml-2 text-xs ${
									isUpdating ? "text-blue-500" : "text-green-500"
								} animate-pulse`}
							>
								{updateMessage}
							</span>
						)}
					</li>
					<li className="col-span-1 flex justify-center">
						<span className="text-black font-bold xl:border-2 border rounded-lg border-gardenGreen px-5 py-2 flex items-center justify-center">
							{task.protocol.id}
						</span>
					</li>
					<li
						className="absolute right-2 top-1/2 translate-y-[-50%]"
						onClick={(e) => e.stopPropagation()}
					>
						<Delete
							className="xl:w-7 xl:h-7 h-5 w-5 fill-current text-gray-500 hover:text-crimsonRed active:text-crimsonRedHover cursor-pointer"
							onClick={handleDeleteClick}
						/>
					</li>
				</ul>
				{isDeleteModalOpen && (
					<DeleteElementModal
						onClose={handleCloseModal}
						onDelete={handleDelete}
						title="Удаление задачи протокола"
						description={`Задача: ${task.essence} для протокола №${task.protocol.id}`}
					/>
				)}
			</>
		);
	}
);

export default ProtocolTaskItem;
