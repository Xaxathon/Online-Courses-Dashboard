import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Calendar from "@assets/icons/calendar.svg";
import Meetings from "@assets/icons/meetings.svg";
import Protocol from "@assets/icons/protocol.svg";
import Settings from "@assets/icons/settings.svg";
import Logout from "@assets/icons/logout.svg";
import { useLogoutMutation } from "../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../features/authSlice";
import { UserRole } from "../../shared/interfaces/user";

const Sidebar: React.FC = () => {
	const [logoutApi] = useLogoutMutation();
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();

	const role = useSelector((state: RootState) => state.auth.role);

	const handleLogout = async () => {
		try {
			await logoutApi().unwrap();
			dispatch(logout());
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	useEffect(() => {
		if (location.pathname === "/main" && role) {
			switch (role) {
				case UserRole.Admin:
					navigate("/main/settings");
					break;
				case UserRole.Manager:
				case UserRole.Secretary:
					navigate("/main/meetings");
					break;
				default:
					break;
			}
		}
	}, [role, navigate, location.pathname]);

	const getOpacity = (path: string) =>
		location.pathname.includes(path) ? "opacity-100" : "opacity-50";

	return (
		<aside className="sticky top-0 left-2 h-screen z-10 mr-4 py-2">
			<nav className="min-h-full z-10 flex flex-col items-center py-10 px-9 gap-9 bg-mainPurple rounded-3xl ">
				<a href="#" className="text-white text-6xl font-baloo cursor-pointer">
					P
				</a>
				<ul className="flex flex-col flex-grow justify-start items-center gap-8">
					{role && [UserRole.Manager, UserRole.Secretary].includes(role) && (
						<li>
							<Link
								to="/main/meetings"
								className={`w-8 h-8 ${getOpacity("/main/meetings")}`}
							>
								<Meetings className="w-8 h-8" />
							</Link>
						</li>
					)}
					{role === UserRole.Secretary && (
						<>
							<li>
								<Link
									to="/main/calendar"
									className={`w-8 h-8 ${getOpacity("/main/calendar")}`}
								>
									<Calendar className="w-8 h-8" />
								</Link>
							</li>
							<li>
								<Link
									to="/main/protocol"
									className={`w-8 h-8 ${getOpacity("/main/protocol")}`}
								>
									<Protocol className="w-8 h-8" />
								</Link>
							</li>
						</>
					)}
					{role &&
						[UserRole.Admin, UserRole.Manager, UserRole.Secretary].includes(
							role
						) && (
							<li>
								<Link
									to="/main/settings"
									className={`w-8 h-8 ${getOpacity("/main/settings")}`}
								>
									<Settings className="w-8 h-8" />
								</Link>
							</li>
						)}
				</ul>
				<button onClick={handleLogout} className="flex-shrink-0">
					<Logout className="w-10 h-10" />
				</button>
			</nav>
		</aside>
	);
};

export default Sidebar;
