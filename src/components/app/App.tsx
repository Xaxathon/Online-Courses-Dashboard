import Protocols from "../../pages/protocols/Protocols";
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
import SettingsForm from "../settingsForm/SettingsForm";
import SecretariesForm from "../secretariesForm/SecretariesForm";
import UserSettings from "../../pages/userSettings/userSettings";

function App() {
	return (
		<div className=" flex">
			<Sidebar />
			<UserSettings />
		</div>
	);
}

export default App;
