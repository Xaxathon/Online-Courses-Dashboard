import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import App from "./components/app/App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	// <React.StrictMode>

	<Provider store={store}>
		<App />
	</Provider>
	// </React.StrictMode>
);
