import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { ReactComponent as Calendar } from "@assets/icons/calendar.svg";
import { ReactComponent as Home } from "@assets/icons/home.svg";
import { ReactComponent as Protocol } from "@assets/icons/protocol.svg";
import { ReactComponent as Settings } from "@assets/icons/settings.svg";
import { ReactComponent as Logout } from "@assets/icons/logout.svg";
import { ReactComponent as Secretaries } from "@assets/icons/home.svg";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

import { useLogoutMutation } from "@/api/authApi";

import { UserRole } from "@/shared/interfaces/user";
import classNames from "classnames";

const Sidebar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();

	const [logoutApi, { isLoading: isLogoutLoading, isError: isLogoutError }] =
		useLogoutMutation();
	const role = useSelector((state: RootState) => state.auth.role);

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
				return "/main/home";
			default:
				return "/main";
		}
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
								<Link to="/main/home" className={getLinkStyle("/main/home")}>
									<Home className="w-8 h-8 fill-current" />
								</Link>
							</li>
							<li>
								<Link
									to="/main/meetings"
									className={getLinkStyle("/main/meetings")}
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
				<Logout
					className={classNames(
						"w-10 h-10 fill-current hover:text-crimsonRed transition-colors duration-200 ease-in-out flex-shrink-0",
						{
							"text-gray-400 cursor-not-allowed": isLogoutLoading,
							"text-white cursor-pointer": !isLogoutLoading,
							"text-crimsonRed": isLogoutError,
						}
					)}
					onClick={handleLogout}
				/>
			</nav>
		</aside>
	);
};

export default Sidebar;
