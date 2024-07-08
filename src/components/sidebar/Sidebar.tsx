import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { ReactComponent as Calendar } from "@assets/icons/calendar.svg";
import { ReactComponent as Meetings } from "@assets/icons/meetings.svg";
import { ReactComponent as Protocol } from "@assets/icons/protocol.svg";
import { ReactComponent as Settings } from "@assets/icons/settings.svg";
import { ReactComponent as Logout } from "@assets/icons/logout.svg";
import { ReactComponent as Secretaries } from "@assets/icons/meetings.svg";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../features/authSlice";

import { useLogoutMutation } from "../../api/authApi";

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

	const getHomeRoute = () => {
		switch (role) {
			case UserRole.Admin:
				return "/main/settings";
			case UserRole.Manager:
				return "/main/secretaries";
			case UserRole.Secretary:
				return "/main/meetings";
			default:
				return "/main";
		}
	};

	useEffect(() => {
		if (location.pathname === "/main" && role) {
			navigate(getHomeRoute());
		}
	}, [role, navigate, location.pathname]);

	const getLinkStyle = (path: string) => {
		const baseStyle = "w-8 h-8 transition-all duration-200 ease-in-out";
		const activeStyle = "text-white";
		const inactiveStyle =
			"text-white/40 hover:text-white/70 active:text-white/20";

		return `${baseStyle} ${
			location.pathname.includes(path) ? activeStyle : inactiveStyle
		}`;
	};

	return (
		<aside className="sticky top-0 left-2 h-screen z-10 mr-4 py-2">
			<nav className="min-h-full z-10 flex flex-col items-center py-10 px-9 gap-9 bg-mainPurple rounded-3xl">
				<Link
					to={getHomeRoute()}
					className="text-white text-6xl font-baloo cursor-pointer"
				>
					P
				</Link>
				<ul className="flex flex-col flex-grow justify-start items-center gap-8">
					{role === UserRole.Manager && (
						<li>
							<Link
								to="/main/secretaries"
								className={getLinkStyle("/main/secretaries")}
							>
								<Secretaries className="w-8 h-8 fill-current" />
							</Link>
						</li>
					)}
					{role === UserRole.Secretary && (
						<>
							<li>
								<Link
									to="/main/meetings"
									className={getLinkStyle("/main/meetings")}
								>
									<Meetings className="w-8 h-8 fill-current" />
								</Link>
							</li>
							<li>
								<Link
									to="/main/calendar"
									className={getLinkStyle("/main/calendar")}
								>
									<Calendar className="w-8 h-8 fill-current" />
								</Link>
							</li>
							<li>
								<Link
									to="/main/protocols"
									className={getLinkStyle("/main/protocols")}
								>
									<Protocol className="w-8 h-8 fill-current" />
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
									className={getLinkStyle("/main/settings")}
								>
									<Settings className="w-8 h-8 fill-current" />
								</Link>
							</li>
						)}
				</ul>
				<button onClick={handleLogout} className="flex-shrink-0">
					<Logout className="w-10 h-10 fill-current text-white hover:text-crimsonRed transition-colors duration-200 ease-in-out" />
				</button>
			</nav>
		</aside>
	);
};

export default Sidebar;
