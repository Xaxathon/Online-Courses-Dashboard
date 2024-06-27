import React, { useEffect } from "react";
import CloseModal from "@assets/icons/сlose-modal.svg";
import Portal from "../portal/Portal";

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	return (
		<Portal>
			<div
				className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
				role="dialog"
				aria-labelledby="modal-title"
			>
				<div className="bg-white shadow-custom py-6 px-7 relative rounded-lg max-w-full mx-4">
					<CloseModal
						className="absolute top-5 right-5 cursor-pointer stroke-[0.20rem] stroke-mainPurple hover:stroke-mainPurpleHover active:stroke-mainPurpleActive"
						onClick={onClose}
					/>
					{children}
				</div>
			</div>
		</Portal>
	);
};

export default Modal;
