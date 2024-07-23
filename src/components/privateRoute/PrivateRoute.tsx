import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { UserRole } from "@/shared/interfaces/user";

interface PrivateRouteProps {
	children: ReactNode;
	allowedRoles?: UserRole[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
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

export default PrivateRoute;
