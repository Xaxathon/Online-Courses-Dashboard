import { memo, useState } from "react";
import classNames from "classnames";
import { ReactComponent as Change } from "@assets/icons/change.svg";
import { ReactComponent as Success } from "@assets/icons/change.svg";
import { ReactComponent as Delete } from "@assets/icons/delete.svg";
import { ReactComponent as Close } from "@assets/icons/сlose-icon.svg";
import DeleteElementModal from "../deleteElementModal/DeleteElementModal";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
	useUpdateKeywordMutation,
	useDeleteKeywordMutation,
} from "@/api/keywordsApi";
import { Keyword } from "@/shared/interfaces/keyword";

const KeywordsItem = memo(({ keyword }: { keyword: Keyword }) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [updateKeyword, { isLoading: isUpdating }] = useUpdateKeywordMutation();
	const [deleteKeyword, { isLoading: isDeleteLoading }] =
		useDeleteKeywordMutation();

	const handleSave = async (values: { title: string; phrase: string }) => {
		await updateKeyword({ ...keyword, ...values });
		setIsEditing(false);
	};

	const handleDelete = async () => {
		if (keyword.id !== undefined) {
			await deleteKeyword({ id: keyword.id });
			setIsDeleteModalOpen(false);
		}
	};

	const validationSchema = Yup.object({
		title: Yup.string().required("Поле обязательно для заполнения"),
		phrase: Yup.string().required("Поле обязательно для заполнения"),
	});

	return (
		<li className="relative mb-5 mr-5 pr-10 text-gardenGreen text-base font-normal rounded-xl bg-gray-100 py-7 px-8 hover:bg-gray-200 transition-colors duration-200">
			<Formik
				initialValues={{ title: keyword.title, phrase: keyword.phrase }}
				validationSchema={validationSchema}
				onSubmit={handleSave}
			>
				{({ isSubmitting }) => (
					<Form
						className={classNames(
							"w-full grid grid-cols-2 gap-3 bg-transparent border-none transition-all duration-500",
							{ "opacity-50": isUpdating }
						)}
					>
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
										onClick={() => setIsEditing(false)}
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
										onClick={() => setIsDeleteModalOpen(true)}
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
					onClose={() => setIsDeleteModalOpen(false)}
					onDelete={handleDelete}
					isLoading={isDeleteLoading}
				/>
			)}
		</li>
	);
});

export default KeywordsItem;
