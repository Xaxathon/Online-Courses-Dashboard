import React from "react";
import { useNavigate } from "react-router-dom";

import { Protocol, ProtocolStage } from "../../shared/interfaces/protocol";

interface ProtocolItemProps {
	protocol: Protocol;
	localNumber: number;
}

const ProtocolItem = React.forwardRef<HTMLLIElement, ProtocolItemProps>(
	({ protocol, localNumber }, ref) => {
		const navigate = useNavigate();

		const getStatus = () => {
			switch (protocol.stage) {
				case ProtocolStage.VideoProcess:
					return "ОБРАБОТКА";
				case ProtocolStage.SuccessVideoProcess:
					return protocol.status;
				case ProtocolStage.ErrorVideoProcess:
					return "ОШИБКА ПРИ ОБРАБОТКЕ";
				default:
					return protocol.stage;
			}
		};

		const handleClick = () => {
			navigate(`/main/protocols/${protocol.id}`);
		};

		return (
			<li
				ref={ref}
				onClick={handleClick}
				className="grid grid-cols-5-protocol-cols justify-center items-center lg:text-sm text-xs text-center bg-gray-100 p-5 text-mainPurple rounded-lg cursor-pointer mb-3 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
			>
				<div className="col-span-5 md:col-span-1">{protocol.theme}</div>
				<div className="col-span-5 md:col-span-1">
					{protocol.secretary.full_name}
				</div>
				<div className="col-span-5 md:col-span-1">{protocol.event_date}</div>
				<div className="col-span-5 md:col-span-1 flex justify-center">
					<span className="text-black font-bold xl:border-2 border-[1px] rounded-lg border-gardenGreen px-5 py-2 flex items-center justify-center">
						{localNumber}
					</span>
				</div>
				<div className="col-span-5 md:col-span-1">{getStatus()}</div>
			</li>
		);
	}
);

ProtocolItem.displayName = "ProtocolItem";

export default ProtocolItem;
