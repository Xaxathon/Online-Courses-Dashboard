import React from "react";
import CloseModal from "@assets/icons/сloseModal.svg";

interface ModalProps {
	children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
	return (
		<div className="absolute flex justify-center items-center top-0 left-0 w-full h-full bg-black bg-opacity-35">
			<div className=" bg-white shadow-custom py-[25px] px-[30px] relative rounded-lg">
				<div className="absolute top-7 cursor-pointer right-7">
					<CloseModal />
				</div>
				{children}
			</div>
		</div>
	);
};

export default Modal;
