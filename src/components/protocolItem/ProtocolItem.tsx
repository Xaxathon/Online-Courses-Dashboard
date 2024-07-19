import { forwardRef } from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import classNames from "classnames";

import { Protocol, ProtocolStage } from "@/shared/interfaces/protocol";

interface ProtocolItemProps {
	protocol: Protocol;
}

const ProtocolItem = forwardRef<HTMLLIElement, ProtocolItemProps>(
	({ protocol }, ref) => {
		const navigate = useNavigate();

		const statusColor = getStatusColor(protocol.status);
		const status = getStatus(protocol);

		const formattedDate = dayjs(protocol.event_date).format("DD.MM.YYYY");

		const isProcessing = protocol.stage === ProtocolStage.VideoProcess;

		const handleClick = () => {
			if (protocol.stage !== ProtocolStage.VideoProcess) {
				navigate(`/main/protocols/${protocol.id}`);
			}
		};

		return (
			<li
				ref={ref}
				onClick={handleClick}
				className={classNames(
					"grid grid-cols-5-protocol-cols justify-center items-center lg:text-sm text-xs text-center p-5 rounded-lg mb-3 transition-colors duration-200",
					{
						"bg-gray-100 hover:bg-gray-200 active:bg-gray-300 cursor-pointer ":
							!isProcessing,
						"bg-yellow-100 cursor-not-allowed": isProcessing,
					}
				)}
			>
				<div
					className={classNames("col-span-5 md:col-span-1", statusColor, {
						"animate-pulse text-yellow-600": isProcessing,
					})}
				>
					{protocol.theme}
				</div>
				<div
					className={classNames("col-span-5 md:col-span-1", statusColor, {
						"animate-pulse text-yellow-600": isProcessing,
					})}
				>
					{protocol.secretary?.full_name || "Не указан"}
				</div>
				<div
					className={classNames("col-span-5 md:col-span-1", statusColor, {
						"animate-pulse text-yellow-600": isProcessing,
					})}
				>
					{formattedDate}
				</div>
				<div className="col-span-5 md:col-span-1 flex justify-center">
					<span
						className={classNames(
							"text-black font-bold xl:border-2 border-[1px] rounded-lg border-gardenGreen px-5 py-2 flex items-center justify-center",
							{
								"animate-pulse text-yellow-600 border-yellow-300": isProcessing,
							}
						)}
					>
						{protocol.protocol_number}
					</span>
				</div>
				<div
					className={classNames("col-span-5 md:col-span-1", statusColor, {
						"animate-pulse text-yellow-600": isProcessing,
					})}
				>
					{status}
				</div>
			</li>
		);
	}
);

export default ProtocolItem;

const getStatusColor = (status: string) => {
	switch (status) {
		case "success":
			return "text-gardenGreen";
		case "process":
			return "text-mainPurple";
		default:
			return "text-mainPurple";
	}
};

const getStatus = (protocol: Protocol) => {
	switch (protocol.stage) {
		case ProtocolStage.VideoProcess:
			return "Обработка видео";
		case ProtocolStage.ErrorVideoProcess:
			return "Ошибка при обработке видео";
		default:
			if (protocol.status === "success") {
				return "Готово";
			} else if (protocol.status === "process") {
				return "В процессе";
			} else {
				return "Неизвестный статус";
			}
	}
};
