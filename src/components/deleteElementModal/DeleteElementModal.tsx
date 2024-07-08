import Modal from "../modal/Modal";

interface DeleteElementModalProps {
	onClose: () => void;
	onDelete: () => void;
	title: string;
	description: string | number;
}

const DeleteElementModal = ({
	onClose,
	onDelete,
	title,
	description,
}: DeleteElementModalProps) => {
	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col mt-5 text-xl font-bold text-mainPurple text-center">
				<span>{title}</span>
				<span className="mt-10 font-bold">{description}</span>
				<span className="mt-3 font-normal text-crimsonRed">
					Вы уверены, что хотите удалить это?
				</span>
				<div className="flex justify-center mt-10">
					<button
						type="button"
						className="mt-4 rounded-xl px-14 py-2 bg-gray-500 text-white text-xl font-bold mr-2 hover:bg-gray-600 active:bg-gray-400"
						onClick={onClose}
					>
						Отменить
					</button>
					<button
						type="button"
						className="mt-4 rounded-xl px-14 py-2 bg-crimsonRed text-white text-xl font-bold hover:bg-crimsonRedHover active:bg-crimsonRedActive"
						onClick={onDelete}
					>
						Удалить
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteElementModal;
