// Sidebar.js
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

const Sidebar = () => {
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
		// Редирект на первую доступную страницу после регистрации
		if (location.pathname === "/main") {
			if (role === "admin") {
				navigate("/main/settings");
			} else if (role === "manager") {
				navigate("/main/meetings");
			} else if (role === "secretary") {
				navigate("/main/meetings");
			}
		}
	}, [role, navigate, location.pathname]);

	const getOpacity = (allowedRole) =>
		role === allowedRole ? "opacity-100" : "opacity-50 pointer-events-none";

	return (
		<aside className="sticky top-0 left-2 h-screen z-10 mr-4 py-2">
			<nav className="min-h-full z-10 flex flex-col items-center py-10 px-9 gap-9 bg-mainPurple rounded-3xl ">
				<a href="#" className="text-white text-6xl font-baloo cursor-pointer">
					P
				</a>
				<ul className="flex flex-col flex-grow justify-start items-center gap-8">
					{role === "admin" && (
						<li>
							<Link to="/main/settings" className={getOpacity("admin")}>
								<Settings className="w-8 h-8" />
							</Link>
						</li>
					)}
					{role === "manager" && (
						<>
							<li>
								<Link to="/main/settings" className={getOpacity("manager")}>
									<Settings className="w-8 h-8" />
								</Link>
							</li>
							<li>
								<Link to="/main/meetings" className={getOpacity("manager")}>
									<Meetings className="w-8 h-8" />
								</Link>
							</li>
						</>
					)}
					{role === "secretary" && (
						<>
							<li>
								<Link to="/main/meetings" className={getOpacity("secretary")}>
									<Meetings className="w-8 h-8" />
								</Link>
							</li>
							<li>
								<Link to="/main/calendar" className={getOpacity("secretary")}>
									<Calendar className="w-8 h-8" />
								</Link>
							</li>
							<li>
								<Link to="/main/protocol" className={getOpacity("secretary")}>
									<Protocol className="w-8 h-8" />
								</Link>
							</li>
							<li>
								<Link to="/main/settings" className={getOpacity("secretary")}>
									<Settings className="w-8 h-8" />
								</Link>
							</li>
						</>
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
