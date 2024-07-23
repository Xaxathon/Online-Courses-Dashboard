import Modal from "../modal/Modal";

interface FreezeUserModalProps {
	onClose: () => void;
	onFreeze: () => void;
	userName: string;
}

const FreezeUserModal = ({
	onClose,
	onFreeze,
	userName,
}: FreezeUserModalProps) => {
	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col mt-5 text-xl font-bold text-mainPurple text-center">
				<span>Заморозка пользователя</span>
				<span className="mt-10 font-bold">{userName}</span>
				<span className="mt-3 font-normal text-crimsonRed">
					Вы уверены, что хотите заморозить этого пользователя?
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
						onClick={onFreeze}
					>
						Заморозить
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default FreezeUserModal;
