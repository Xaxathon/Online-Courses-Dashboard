import Protocol from "../../pages/protocol/Protocol";
import Sidebar from "../sidebar/Sidebar";

function App() {
	return (
		<div className="flex">
			<Sidebar />
			<Protocol />
		</div>
	);
}

export default App;
