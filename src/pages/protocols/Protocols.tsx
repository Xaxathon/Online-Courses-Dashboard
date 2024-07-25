import { Link } from "react-router-dom";

import { ReactComponent as AddProtocolIcon } from "@assets/icons/add-icon.svg";

import ProtocolList from "@components/protocolList/ProtocolList";

const Protocols = () => {
	return (
		<div className="flex flex-col h-[calc(100vh-1.75rem)] w-full md:mx-auto 2xl:mx-5 px-4">
			<div className="flex-shrink-0 mt-7">
				<div className="min-w-full font-bold text-mainPurple text-xl rounded-xl bg-gray-100 flex justify-between items-center px-7 py-2">
					<h1>Протоколы</h1>
					<div className="flex items-center gap-4">
						<h2>Создать новый протокол</h2>
						<Link to="/main/protocols/add">
							<AddProtocolIcon className="w-10 h-10" />{" "}
						</Link>
					</div>
				</div>
				<ul className="grid grid-cols-5-protocol-cols font-bold  justify-center px-5 xl:text-lg text-base text-center text-mainPurple mt-4 mb-2">
					<li>Тема</li>
					<li>Секретарь</li>
					<li>Дата</li>
					<li>№Протокола</li>
					<li>Статус</li>
				</ul>
			</div>
			<div className="flex-grow overflow-hidden mt-2">
				<ProtocolList />
			</div>
		</div>
	);
};

export default Protocols;
