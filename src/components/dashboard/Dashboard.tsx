import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ReactComponent as Spinner } from "@/assets/icons/spinner.svg";

import Sidebar from "@components/sidebar/Sidebar";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";
import NotFoundPage from "@pages/404/NotFoundPage";
import ErrorBoundary from "@/components/errorBoundary/ErrorBoundary";

const MainPage = lazy(() => import("@pages/mainPage/MainPage"));
const Settings = lazy(() => import("@pages/settings/Settings"));
const UserSetting = lazy(() => import("@/pages/userSetting/UserSetting"));
const KeywordSetting = lazy(
	() => import("@/pages/keywordSetting/KeywordSetting")
);

const Secretaries = lazy(() => import("@pages/secretaries/Secretaries"));
const Protocols = lazy(() => import("@pages/protocols/Protocols"));
const Protocol = lazy(() => import("@pages/protocol/Protocol"));
const Meetings = lazy(() => import("@pages/meetings/Meetings"));
const ProtocolAddForm = lazy(
	() => import("@components/protocolAddForm/ProtocolAddForm")
);

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { UserRole } from "@/shared/interfaces/user";

const Dashboard = () => {
	const role = useSelector((state: RootState) => state.auth.role);

	if (role === null) {
		return (
			<div className="flex justify-center items-center h-screen w-screen">
				<Spinner />
			</div>
		);
	}
	return (
		<div className="flex">
			<Sidebar />
			<ErrorBoundary>
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
								role === UserRole.Secretary ? (
									<Navigate to="/main/home" replace />
								) : role === UserRole.Manager ? (
									<Navigate to="/main/secretaries" replace />
								) : (
									<Navigate to="/main/settings" replace />
								)
							}
						/>

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
									<UserSetting />
								</PrivateRoute>
							}
						/>

						{role === UserRole.Manager && (
							<Route path="secretaries" element={<Secretaries />} />
						)}

						{role === UserRole.Secretary && (
							<>
								<Route path="home" element={<MainPage />} />
								<Route path="settings/keywords" element={<KeywordSetting />} />
								<Route path="protocols" element={<Protocols />} />
								<Route path="meetings" element={<Meetings />} />
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
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default Dashboard;
