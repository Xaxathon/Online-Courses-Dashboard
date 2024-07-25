import { useEffect, Suspense } from "react";

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	Outlet,
} from "react-router-dom";

import { ReactComponent as Spinner } from "@/assets/icons/spinner.svg";

import Login from "@components/login/Login";
import ForgotPassword from "@components/forgotPassword/ForgotPassword";
import NotFoundPage from "@pages/404/NotFoundPage";
import ProtocolNotification from "@/components/protocolNotification/ProtocolNotification";
import ResetPassword from "@components/resetPassword/ResetPassword";

import PrivateRoute from "@components/privateRoute/PrivateRoute";
import Dashboard from "@components/dashboard/Dashboard";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setToken, setRole } from "@/store/slices/authSlice";

import { UserRole } from "@/shared/interfaces/user";

const App = () => {
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: any) => state.auth.token);

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
					<Route
						path="/"
						element={
							token ? (
								<Navigate to="/main" replace />
							) : (
								<Navigate to="/login" replace />
							)
						}
					/>

					<Route element={<AnonymousRoute />}>
						<Route path="/login" element={<Login />} />
						<Route path="/change-password" element={<ForgotPassword />} />
						<Route path="/change-password/:token" element={<ResetPassword />} />
					</Route>

					<Route
						path="/main/*"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
				<ProtocolNotification />
			</Suspense>
		</Router>
	);
};

export default App;

const AnonymousRoute = () => {
	const token = useSelector((state: any) => state.auth.token);

	return token ? <Navigate to="/main" replace /> : <Outlet />;
};
