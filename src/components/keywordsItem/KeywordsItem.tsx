import { useState } from "react";

import classNames from "classnames";

import { ReactComponent as Change } from "@assets/icons/change.svg";
import { ReactComponent as Success } from "@assets/icons/change.svg";
import { ReactComponent as Delete } from "@assets/icons/delete.svg";
import { ReactComponent as Close } from "@assets/icons/сlose-modal.svg";

import DeleteElementModal from "../deleteElementModal/DeleteElementModal";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
	useUpdateKeywordMutation,
	useDeleteKeywordMutation,
} from "../../api/keywordsApi";

import { Keyword } from "../../shared/interfaces/keyword";

interface KeywordsItemProps {
	keyword: Keyword;
}

const KeywordsItem: React.FC<KeywordsItemProps> = ({ keyword }) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [updateKeyword] = useUpdateKeywordMutation();
	const [deleteKeyword] = useDeleteKeywordMutation();

	const [apiError, setApiError] = useState<string | null>(null);

	const handleSave = async (values: { title: string; phrase: string }) => {
		try {
			await updateKeyword({ ...keyword, ...values }).unwrap();
			setIsEditing(false);
			setApiError(null);
		} catch (error) {
			setApiError(
				"Ошибка при обновлении ключевого слова. Пожалуйста, попробуйте еще раз."
			);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setApiError(null);
	};

	const handleDeleteOpenModal = () => {
		setIsDeleteModalOpen(true);
	};

	const handleDeleteCloseModal = () => {
		setIsDeleteModalOpen(false);
	};

	const handleDelete = async () => {
		if (keyword.id !== undefined) {
			try {
				await deleteKeyword({ id: keyword.id }).unwrap();
				handleDeleteCloseModal();
				setApiError(null);
			} catch (error) {
				setApiError(
					"Ошибка при удалении ключевого слова. Пожалуйста, попробуйте еще раз."
				);
			}
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
						{apiError && (
							<div className="col-span-2 text-crimsonRed text-sm mt-2">
								{apiError}
							</div>
						)}
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
										onClick={handleDeleteOpenModal}
									/>
								</>
							)}
						</div>
					</Form>
				)}
			</Formik>
			{isDeleteModalOpen && (
				<DeleteElementModal
					title="Удаление ключевого слова"
					description={`${keyword.title.slice(0, 10)} (ID: ${keyword.id})`}
					onClose={handleDeleteCloseModal}
					onDelete={handleDelete}
				/>
			)}
		</li>
	);
};

export default KeywordsItem;
