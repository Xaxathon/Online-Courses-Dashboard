import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Backward } from "@assets/icons/backward.svg";
import { ReactComponent as AddKeywordIcon } from "@assets/icons/add-icon.svg";

import KeywordsList from "@components/keywordsList/KeywordsList";
import KeywordAddModal from "@components/keywordAddModal/KeywordAddModal";

const KeywordSetting = () => {
	const navigate = useNavigate();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleBack = () => {
		navigate(-1);
	};

	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	return (
		<div className="mt-7 w-full mr-4">
			<div className="min-w-full flex items-center justify-between py-2 px-10 font-bold text-mainPurple rounded-xl bg-gray-100">
				<Backward
					className="w-9 h-9 cursor-pointer fill-current text-mainPurple hover:text-mainPurpleHover active:text-mainPurpleActive"
					onClick={handleBack}
				/>

				<h1 className="text-center w-full lg:text-2xl text-xl">
					Ключевые слова
				</h1>

				<AddKeywordIcon
					className="w-9 h-9 cursor-pointer "
					onClick={handleOpenModal}
				/>
			</div>
			<div className="max-w-6xl  grid grid-cols-2 items-center mt-10 gap-3 font-bold mx-auto text-mainPurple text-lg rounded-xl bg-gray-100 py-4 px-8">
				<h2>Название</h2>
				<h2>Фраза</h2>
			</div>
			<KeywordsList />
			{isModalOpen && <KeywordAddModal onClose={handleCloseModal} />}
		</div>
	);
};

export default KeywordSetting;
