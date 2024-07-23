import { useState, useRef } from "react";

import {
	Formik,
	Form,
	Field,
	FieldArray,
	ErrorMessage,
	FormikProps,
	FormikHelpers,
} from "formik";
import * as Yup from "yup";

import Modal from "../modal/Modal";
import ExternalUserAddModal from "../externalUserAddModal/ExternalUserAddModal";

import { useCreateProtocolTaskMutation } from "@/api/protocolsApi";

import { ExternalUser, InternalUser } from "@/shared/interfaces/user";
import { Protocol, ProtocolTaskData } from "@/shared/interfaces/protocol";

interface ProtocolTaskAddModalProps {
	protocolId: number;
	protocolData: Protocol;
	onClose: () => void;
}

interface FormTaskData {
	responsible_id: number;
	responsible_name: string;
	essence: string;
}

interface ProtocolTaskForm {
	tasks: FormTaskData[];
	deadline: string;
}

const validationSchema = Yup.object().shape({
	tasks: Yup.array().of(
		Yup.object().shape({
			responsible_id: Yup.number().required("Обязательное поле"),
			responsible_name: Yup.string().required("Обязательное поле"),
			essence: Yup.string().required("Обязательное поле"),
		})
	),
	deadline: Yup.date().required("Обязательное поле"),
});

const ProtocolTaskAddModal = ({
	protocolId,
	protocolData,
	onClose,
}: ProtocolTaskAddModalProps) => {
	const formRef = useRef<FormikProps<ProtocolTaskForm>>(null);

	const [isModalOpenUser, setIsModalOpenUser] = useState<boolean>(false);
	const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [createTask, { isError: isCreateError }] =
		useCreateProtocolTaskMutation();

	const handleSubmit = async (
		values: ProtocolTaskForm,
		{ setSubmitting }: FormikHelpers<ProtocolTaskForm>
	) => {
		setIsSaving(true);
		try {
			if (protocolData) {
				for (const task of values.tasks) {
					const taskData: ProtocolTaskData = {
						...task,
						deadline: values.deadline,
						status: "",
					};
					{
						/* бэк сам определяет статус */
					}
					await createTask({
						protocolId,
						data: taskData,
					}).unwrap();
				}
				onClose();
			}
		} catch (error) {
			console.error("Failed to create task:", error);
		} finally {
			setSubmitting(false);
			setIsSaving(false);
		}
	};

	const handleOpenModalUser = (index: number) => {
		setCurrentTaskIndex(index);
		setIsModalOpenUser(true);
	};

	const handleCloseModalUser = () => {
		setIsModalOpenUser(false);
		setCurrentTaskIndex(null);
	};

	const handleUserSelect = (user: InternalUser | ExternalUser) => {
		if (currentTaskIndex !== null && formRef.current) {
			const { setFieldValue } = formRef.current;
			setFieldValue(`tasks[${currentTaskIndex}].responsible_id`, user.id);
			setFieldValue(
				`tasks[${currentTaskIndex}].responsible_name`,
				user.full_name
			);
		}
		handleCloseModalUser();
	};

	return (
		<Modal onClose={onClose}>
			<Formik
				initialValues={{
					tasks: [{ responsible_id: 0, responsible_name: "", essence: "" }],
					deadline: "",
				}}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
				innerRef={formRef}
			>
				{({ values }) => (
					<Form className="mt-14 text-xl font-bold text-mainPurple text-center">
						<div className="h-[20rem] grid grid-cols-2 gap-4 mb-4 overflow-y-auto">
							<div>
								<h2 className="mb-2">Задача</h2>
								<FieldArray name="tasks">
									{() => (
										<div className="flex flex-col p-1 gap-3">
											{values.tasks.map((_, index) => (
												<div key={index}>
													<Field
														name={`tasks[${index}].essence`}
														className="w-full text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
														type="text"
													/>
													<ErrorMessage
														name={`tasks[${index}].essence`}
														component="div"
														className="text-crimsonRed mt-1 text-start text-sm"
													/>
												</div>
											))}
										</div>
									)}
								</FieldArray>
							</div>
							<div>
								<h2 className="mb-2">Ответственный</h2>
								<FieldArray name="tasks">
									{() => (
										<div className="flex flex-col p-1  gap-3">
											{values.tasks.map((_, index) => (
												<div key={index}>
													<Field
														name={`tasks[${index}].responsible_name`}
														className="w-full text-base bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent cursor-pointer hover:bg-lightPurpleHover"
														onClick={() => handleOpenModalUser(index)}
														readOnly
													/>
													<ErrorMessage
														name={`tasks[${index}].responsible_name`}
														component="div"
														className="text-crimsonRed mt-1 text-start  text-sm"
													/>
												</div>
											))}
										</div>
									)}
								</FieldArray>
							</div>
						</div>

						<div className="flex items-end justify-between mt-7">
							<div className="flex flex-col px-10">
								<label htmlFor="deadline">Дата</label>
								<Field
									name="deadline"
									type="date"
									className="text-xl my-2 bg-lightPurple p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								/>
								<ErrorMessage
									name="deadline"
									component="div"
									className="text-crimsonRed mt-1  text-start text-sm"
								/>
							</div>
							<div className="flex justify-end gap-4 mb-2">
								<FieldArray name="tasks">
									{({ push }) => (
										<button
											type="button"
											className="py-3 px-2 rounded-lg bg-mainPurple text-white font-bold text-center hover:bg-mainPurpleHover active:bg-mainPurpleActive"
											onClick={() =>
												push({
													responsible_id: 0,
													responsible_name: "",
													essence: "",
												})
											}
										>
											Добавить поле
										</button>
									)}
								</FieldArray>
								<button
									type="submit"
									className={`py-3 px-2 rounded-lg text-white font-bold text-center ${
										isSaving
											? "bg-gray-500 cursor-not-allowed"
											: "bg-mainPurple hover:bg-mainPurpleHover active:bg-mainPurpleActive"
									}`}
									disabled={isSaving}
								>
									Сохранить
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
			{isCreateError && (
				<div className="text-crimsonRed mt-4">
					Произошла ошибка при сохранении задачи
				</div>
			)}
			{isModalOpenUser && (
				<ExternalUserAddModal
					onClose={handleCloseModalUser}
					onUserSelect={handleUserSelect}
				/>
			)}
		</Modal>
	);
};

export default ProtocolTaskAddModal;
