import React, { ReactNode, useEffect, lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setToken, setRole } from "../../features/authSlice";
import { UserRole } from "../../shared/interfaces/user";

import Sidebar from "../sidebar/Sidebar";
import Meetings from "../../pages/meetings/Meetings";
import Login from "../login/Login";
import ForgotPassword from "../forgotPassword/ForgotPassword";

import { ReactComponent as Spinner } from "../../assets/icons/spinner.svg";

const Settings = lazy(() => import("../../pages/settings/Settings"));
const UserSettings = lazy(
	() => import("../../pages/userSettings/UserSettings")
);
const Keywords = lazy(() => import("../../pages/keywords/Keywords"));
const Secretaries = lazy(() => import("../../pages/secretaries/Secretaries"));
const Protocols = lazy(() => import("../../pages/protocols/Protocols"));
const Appointment = lazy(() => import("../../pages/appointment/Appointment"));
const ProtocolAddForm = lazy(
	() => import("../protocolAddForm/protocolAddForm")
);
const Protocol = lazy(() => import("../../pages/protocol/Protocol"));

interface PrivateRouteProps {
	children: ReactNode;
	allowedRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
	children,
	allowedRoles,
}) => {
	const token = useSelector((state: RootState) => state.auth.token);
	const role = useSelector((state: RootState) => state.auth.role);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate("/login");
		} else if (allowedRoles && !allowedRoles.includes(role as UserRole)) {
			navigate("/main");
		}
	}, [token, role, allowedRoles, navigate]);

	return <>{children}</>;
};

const App: React.FC = () => {
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
			<Suspense
				fallback={
					<div className="flex justify-center items-center h-screen w-screen">
						<Spinner />
					</div>
				}
			>
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
			</Suspense>
		</Router>
	);
};

const Dashboard: React.FC = () => {
	const role = useSelector((state: RootState) => state.auth.role);

	return (
		<div className="flex">
			<Sidebar />
			<Suspense
				fallback={
					<div className="flex justify-center items-center h-screen w-screen">
						<Spinner />
					</div>
				}
			>
				<Routes>
					<Route
						path="settings"
						element={
							<PrivateRoute
								allowedRoles={[
									UserRole.Admin,
									UserRole.Manager,
									UserRole.Secretary,
								]}
							>
								<Settings />
							</PrivateRoute>
						}
					/>
					<Route
						path="settings/users"
						element={
							<PrivateRoute
								allowedRoles={[
									UserRole.Admin,
									UserRole.Manager,
									UserRole.Secretary,
								]}
							>
								<UserSettings />
							</PrivateRoute>
						}
					/>

					{role === UserRole.Admin && (
						<>
							{/* При расширение проекта, можно добавить сюда новые админские роуты */}
						</>
					)}
					{role === UserRole.Manager && (
						<>
							<Route path="secretaries" element={<Secretaries />} />
						</>
					)}

					{role === UserRole.Secretary && (
						<>
							<Route path="settings/keywords" element={<Keywords />} />
							<Route path="meetings" element={<Meetings />} />
							<Route path="protocols" element={<Protocols />} />
							<Route path="calendar" element={<Appointment />} />
							<Route path="protocols/add" element={<ProtocolAddForm />} />
							<Route
								path="/protocols/:id"
								element={
									<PrivateRoute>
										<Protocol />
									</PrivateRoute>
								}
							/>
						</>
					)}
				</Routes>
			</Suspense>
		</div>
	);
};

export default App;
