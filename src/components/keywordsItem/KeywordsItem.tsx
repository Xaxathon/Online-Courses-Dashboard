import React, { useState } from "react";
import classNames from "classnames";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ReactComponent as Change } from "@assets/icons/change.svg";
import { ReactComponent as Success } from "@assets/icons/change.svg";
import { ReactComponent as Delete } from "@assets/icons/delete.svg";
import { ReactComponent as Close } from "@assets/icons/сlose-modal.svg";

import { Keyword } from "../../shared/interfaces/keyword";
import {
	useUpdateKeywordMutation,
	useDeleteKeywordMutation,
	useFetchKeywordsQuery,
} from "../../api/keywordsApi";
import KeywordDeleteModal from "../keywordDeleteModal/KeywordDeleteModal";

interface KeywordsItemProps {
	keyword: Keyword;
}

const KeywordsItem = ({ keyword }: KeywordsItemProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [updateKeyword] = useUpdateKeywordMutation();
	const [deleteKeyword] = useDeleteKeywordMutation();
	const { refetch: refetchKeywords } = useFetchKeywordsQuery();
	const handleSave = async (values: { title: string; phrase: string }) => {
		await updateKeyword({ ...keyword, ...values });
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		refetchKeywords();
	};

	const handleDelete = async () => {
		if (keyword.id !== undefined) {
			await deleteKeyword({ id: keyword.id });
			handleCloseModal();
		} else {
			console.error("Ошибка: ID ключевого слова не определен");
		}
	};

	const validationSchema = Yup.object({
		title: Yup.string().required("Название обязательно"),
		phrase: Yup.string().required("Фраза обязательна"),
	});

	return (
		<li className="relative mb-5 mr-5 pr-10 text-gardenGreen text-base font-normal rounded-xl bg-gray-100 py-7 px-8">
			<Formik
				initialValues={{ title: keyword.title, phrase: keyword.phrase }}
				validationSchema={validationSchema}
				onSubmit={handleSave}
			>
				{({ isSubmitting }) => (
					<Form className="w-full grid grid-cols-2 gap-3">
						<div className="w-full">
							<Field
								className={classNames(
									"min-h-10 w-full text-base p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent",
									{
										"bg-lightPurple text-mainPurple resize-y": isEditing,
										"bg-transparent text-gardenGreen resize-none": !isEditing,
									}
								)}
								name="title"
								component="textarea"
								rows={1}
								disabled={!isEditing}
							/>
							<ErrorMessage
								name="title"
								component="div"
								className="text-crimsonRed text-sm mt-1"
							/>
						</div>
						<div className="w-full">
							<Field
								className={classNames(
									"min-h-10 w-full text-base p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent",
									{
										"bg-lightPurple text-mainPurple resize-y": isEditing,
										"bg-transparent text-gardenGreen resize-none": !isEditing,
									}
								)}
								name="phrase"
								component="textarea"
								rows={1}
								disabled={!isEditing}
							/>
							<ErrorMessage
								name="phrase"
								component="div"
								className="text-crimsonRed text-sm mt-1"
							/>
						</div>
						<div className="flex flex-col items-start justify-center absolute top-1/2 transform -translate-y-1/2 -right-5 gap-4">
							{isEditing ? (
								<>
									<button
										type="submit"
										className="cursor-pointer h-8 w-8 fill-current text-gardenGreen hover:text-gardenGreenHover"
										disabled={isSubmitting}
									>
										<Success />
									</button>
									<Close
										className="cursor-pointer h-8 w-8 stroke-[0.2rem] stroke-crimsonRed hover:stroke-crimsonRedHover active:stroke-crimsonRedActive"
										onClick={handleCancel}
									/>
								</>
							) : (
								<>
									<Change
										className="cursor-pointer h-8 w-8 fill-current text-mainPurple hover:text-mainPurpleHover"
										onClick={() => setIsEditing(true)}
									/>

									<Delete
										className="cursor-pointer h-8 w-8 fill-current text-gray-600 hover:text-crimsonRedHover"
										onClick={handleOpenModal}
									/>
								</>
							)}
						</div>
					</Form>
				)}
			</Formik>
			{isModalOpen && (
				<KeywordDeleteModal
					onClose={handleCloseModal}
					onDelete={handleDelete}
					keywordId={keyword.id}
					keywordTitle={keyword.title}
				/>
			)}
		</li>
	);
};

export default KeywordsItem;
