import { ReactNode, useEffect } from "react";
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
import { UserRole } from "../../shared/interfaces/user";
import Keywords from "../../pages/keywords/Keywords";
import ForgotPassword from "../forgotPassword/ForgotPassword";
import Meetings from "../../pages/meetings/Meetings";
import Secretaries from "../../pages/secretaries/Secretaries";
import Protocol from "../../pages/protocol/Protocol";
import Protocols from "../../pages/protocols/Protocols";
import Appointment from "../../pages/appointment/Appointment";
import AppointmentAddModal from "../appointmentUserAddModal/AppointmentAddUserModal";
import AppointmentTimeAddFormModal from "../appointmentTimeAddFormModal/AppointmentTimeAddFormModal";

interface PrivateRouteProps {
	children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
	const token = useSelector((state: RootState) => state.auth.token);

	return token ? children : <Navigate to="/login" />;
};

const App = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		if (token) {
			dispatch(setToken(token));
		}
		if (role) {
			dispatch(setRole(role as UserRole));
		}
	}, [dispatch]);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/reset-password" element={<ForgotPassword />} />
				<Route
					path="/main/*"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
			</Routes>
		</Router>
	);
};

const Dashboard = () => (
	<div className="flex">
		<Sidebar />
		<Routes>
			<Route path="settings" element={<Settings />} />
			<Route path="settings/users" element={<UserSettings />} />
			<Route path="settings/keywords" element={<Keywords />} />
			<Route path="meetings" element={<Meetings />} />
			<Route path="secretaries" element={<Secretaries />} />
			<Route path="protocols" element={<Protocols />} />
			<Route path="calendar" element={<Appointment />} />
		</Routes>
	</div>
);

export default App;
