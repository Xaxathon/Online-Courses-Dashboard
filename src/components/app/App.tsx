import KpiChart from "../kpiChart/KpiChart";
import ProtocolModal from "../protocolModal/ProtocolModal";
import Sidebar from "../sidebar/Sidebar";
import Search from "@assets/icons/search.svg";
import Rectangle from "@assets/img/Rectangle.jpg";
import StatWidget from "../statWidget/StatWidget";
import SecretaryList from "../secretaryList/SecretaryList";
import Secretaries from "../../pages/secretaries/Secretaries";
import Backward from "@assets/icons/backward.svg";
import Secretary from "../../pages/secretary/Secretary";
import AddProtocol from "../../pages/addProtocol/AddProtocol";
import Meetings from "../../pages/meetings/Meetings";
import Settings from "../../pages/settings/Settings";
import AddProtocolIcon from "@assets/icons/addProtocol.svg";
import Change from "@assets/icons/change.svg";
import Keywords from "../../pages/keywords/Keywords";

import Participant from "@assets/img/participant.jpg";
import SettingsForm from "../userForm/UserForm";
import SecretariesForm from "../secretaryForm/SecretaryForm";
import UserSettings from "../../pages/userSettings/UserSettings";
import SecretaryAddForm from "../secretaryAddFormModal/SecretaryAddFormModal";
import Protocol from "../../pages/protocol/Protocol";
import Protocols from "../../pages/protocols/Protocols";
function App() {
	return (
		<div className="relative flex ">
			<div className="sticky top-0 left-2 z-10 h-screen">
				<Sidebar />
			</div>
			<Secretary />
		</div>
	);
}

export default App;

// <Protocol />  <UserSettings /> <Keywords /> <AddProtocol /> <Protocols /> <Meetings /> <Settings /> <Secretaries /> <Secretary />
