import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Portal from "../portal/Portal";

import { RootState, AppDispatch } from "../../store/store";
import { hideNotification } from "../../store/slices/notificationSlice";

const Notification = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { message, isVisible, protocolId } = useSelector(
		(state: RootState) => state.notification
	);

	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				dispatch(hideNotification());
			}, 7000);

			return () => clearTimeout(timer);
		}
	}, [isVisible, dispatch]);

	if (!isVisible) return null;

	const handleClick = () => {
		if (protocolId) {
			navigate(`/main/protocols/${protocolId}`);
		}
		dispatch(hideNotification());
	};

	return (
		<Portal wrapperId="notification-portal">
			<div
				className="fixed top-4 right-4 bg-gardenGreen hover:bg-gardenGreenHover text-white p-4 rounded shadow-lg animate-fade-in-out cursor-pointer"
				onClick={handleClick}
			>
				{message}
			</div>
		</Portal>
	);
};

export default Notification;
