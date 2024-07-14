import Modal from "../modal/Modal";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";

import {
	useCreateKeywordMutation,
	useFetchKeywordsQuery,
} from "@/api/keywordsApi";

import { KeywordAdd } from "@/shared/interfaces/keyword";

interface KeywordAddModalProps {
	onClose: () => void;
}
const KeywordAddModal = ({ onClose }: KeywordAddModalProps) => {
	const [createKeyword, { isError: isCreateError }] =
		useCreateKeywordMutation();
	const { refetch } = useFetchKeywordsQuery();

	const validationSchema = Yup.object({
		title: Yup.string()
			.min(5, "Поле должно содержать минимум 5 символов")
			.max(200, "Поле должно содержать максимум 200 символов")
			.required("Поле обязательно для заполнения"),
		phrase: Yup.string()
			.min(5, "Поле должно содержать минимум 5 символов")
			.max(200, "Поле должно содержать максимум 200 символов")
			.required("Поле обязательно для заполнения"),
	});

	const initialValues: KeywordAdd = {
		title: "",
		phrase: "",
	};

	const handleSubmit = async (
		values: { title: string; phrase: string },
		{ resetForm }: { resetForm: () => void }
	) => {
		try {
			await createKeyword({ keywords: [values] }).unwrap();
			resetForm();
			onClose();
			await refetch();
		} catch (error) {
			console.error("Ошибка при добавлении ключевого слова:", error);
		}
	};

	return (
		<Modal onClose={onClose}>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting }) => (
					<Form className="w-[30rem] flex flex-col gap-6 mt-10 text-xl font-bold text-mainPurple">
						<span className="text-center mb-3">Добавление ключевого слова</span>
						<div className="flex flex-col gap-1">
							<label htmlFor="title">Название</label>
							<Field
								className="text-mainPurple text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="title"
								name="title"
								type="text"
							/>
							<ErrorMessage
								name="title"
								component="div"
								className="text-crimsonRed text-sm"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="phrase">Фраза</label>
							<Field
								className="text-mainPurple text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="phrase"
								name="phrase"
								type="text"
							/>
							<ErrorMessage
								name="phrase"
								component="div"
								className="text-crimsonRed text-sm"
							/>
						</div>
						{isCreateError && (
							<span className="block mx-auto text-crimsonRed text-sm mt-2">
								{" "}
								Не удалось добавить ключевое слово. Попробуйте еще раз.
							</span>
						)}
						<button
							className={classNames(
								"px-20 mt-5 py-2 mx-auto text-white rounded-lg",
								{
									"bg-gray-500 cursor-not-allowed": isSubmitting,
									"bg-mainPurple hover:bg-mainPurpleHover active:bg-mainPurpleActive":
										!isSubmitting,
								}
							)}
							type="submit"
							disabled={isSubmitting}
						>
							Добавить
						</button>
					</Form>
				)}
			</Formik>
		</Modal>
	);
};

export default KeywordAddModal;
