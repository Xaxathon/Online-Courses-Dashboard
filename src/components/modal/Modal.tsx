import { useState, useEffect } from "react";

import { ReactComponent as CloseModal } from "@assets/icons/сlose-icon.svg";

import classNames from "classnames";

import Portal from "../portal/Portal";

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		document.body.classList.add("overflow-hidden");
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleClose();
			}
		};
		window.addEventListener("keydown", handleEsc);

		setTimeout(() => setIsVisible(true), 10);

		return () => {
			document.body.classList.remove("overflow-hidden");
			window.removeEventListener("keydown", handleEsc);
		};
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(onClose, 200);
	};

	return (
		<Portal>
			<div
				className={classNames(
					"fixed inset-0 flex justify-center items-center bg-black transition-opacity duration-200 ease-in-out",
					{
						"bg-opacity-50": isVisible,
						"bg-opacity-0": !isVisible,
						visible: isVisible,
						invisible: !isVisible,
					}
				)}
				role="dialog"
				aria-labelledby="modal-title"
			>
				<div
					className={classNames(
						"bg-white shadow-custom py-6 px-7 relative rounded-lg max-w-full mx-4 transition-all duration-200 ease-in-out",
						{
							"opacity-100 scale-100": isVisible,
							"opacity-0 scale-95": !isVisible,
						}
					)}
				>
					<CloseModal
						className={classNames(
							"absolute top-5 right-5 cursor-pointer stroke-[0.20rem]",
							"stroke-mainPurple hover:stroke-mainPurpleHover active:stroke-mainPurpleActive"
						)}
						onClick={handleClose}
					/>
					{children}
				</div>
			</div>
		</Portal>
	);
};

export default Modal;
