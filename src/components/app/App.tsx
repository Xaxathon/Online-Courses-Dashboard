// App.js
import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "../login/Login";
import Sidebar from "../sidebar/Sidebar";
import UserSettings from "../../pages/userSettings/UserSettings";
import Settings from "../../pages/settings/Settings";
import { AppDispatch, RootState } from "../../store/store";
import { setToken, setRole } from "../../features/authSlice";

const PrivateRoute = ({ children }) => {
	const token = useSelector((state: RootState) => state.auth.token);
	console.log("Token in PrivateRoute:", token); // Отладочное сообщение
	return token ? children : <Navigate to="/login" />;
};

const AdminDashboard = () => (
	<div className="flex">
		<Sidebar />
		<Routes>
			<Route path="settings" element={<Settings />} />
			<Route path="settings/users" element={<UserSettings />} />
		</Routes>
	</div>
);

const App = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		if (token) {
			dispatch(setToken(token));
		}
		if (role) {
			dispatch(setRole(role));
		}
	}, [dispatch]);

	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					path="/main/*"
					element={
						<PrivateRoute>
							<AdminDashboard />
						</PrivateRoute>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
