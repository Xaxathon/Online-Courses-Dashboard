import React, { useEffect } from "react";
import CloseModal from "@assets/icons/сloseModal.svg";

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
		<div
			onClick={onClose}
			className="absolute flex justify-center items-center top-0 left-0 w-full h-full bg-black bg-opacity-35"
			role="dialog"
			aria-labelledby="modal-title"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-white shadow-custom py-6 px-7 relative rounded-lg max-w-full mx-4"
			>
				<CloseModal
					className="absolute top-3 right-3 cursor-pointer"
					onClick={onClose}
				/>

				{children}
			</div>
		</div>
	);
};

export default Modal;
