import Meetings from "../../pages/meetings/Meetings";

import Sidebar from "../sidebar/Sidebar";

function App() {
	return (
		<div className="flex">
			<Sidebar />
			<Meetings />
		</div>
	);
}

export default App;
