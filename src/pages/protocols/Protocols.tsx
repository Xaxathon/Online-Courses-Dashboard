import { Link } from "react-router-dom";

import { ReactComponent as AddProtocolIcon } from "@assets/icons/add-icon.svg";

import ProtocolList from "@components/protocolList/ProtocolList";

const Protocols = () => {
	return (
		<div className="container mt-7 md:mx-auto px-2">
			<div className="font-bold text-mainPurple text-xl rounded-xl bg-gray-100 flex justify-between items-center px-7 py-2">
				<h1>Протоколы</h1>
				<div className="flex items-center gap-4">
					<h2>Создать новый протокол</h2>
					<Link to="/main/protocols/add">
						<AddProtocolIcon className="w-10 h-10" />{" "}
					</Link>
				</div>
			</div>
			<ul className="grid grid-cols-5-protocol-cols font-bold  justify-center xl:text-lg text-base text-center text-mainPurple mt-4">
				<li>Тема</li>
				<li>Секретарь</li>
				<li>Дата</li>
				<li>№Протокола</li>
				<li>Статус</li>
			</ul>

			<ProtocolList />
		</div>
	);
};

export default Protocols;
