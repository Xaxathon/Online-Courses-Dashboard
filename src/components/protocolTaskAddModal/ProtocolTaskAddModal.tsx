import React, { useState, useCallback, useRef } from "react";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

import Modal from "../modal/Modal";
import ExternalUserAddModal from "../externalUserAddModal/ExternalUserAddModal";

import { useCreateProtocolTaskMutation } from "@/api/protocolsApi";

import { ExternalUser, InternalUser } from "@/shared/interfaces/user";

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

const ProtocolTaskAddModal: React.FC<{
	protocolId: number;
	protocolData: any;
	onClose: () => void;
}> = ({ protocolId, protocolData, onClose }) => {
	const [isModalOpenUser, setIsModalOpenUser] = useState<boolean>(false);
	const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
	const [createTask, { error: backendError }] = useCreateProtocolTaskMutation();
	const formRef = useRef<any>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleOpenModalUser = useCallback((index: number) => {
		setCurrentTaskIndex(index);
		setIsModalOpenUser(true);
	}, []);

	const handleCloseModalUser = useCallback(() => {
		setIsModalOpenUser(false);
		setCurrentTaskIndex(null);
	}, []);

	const handleUserSelect = useCallback(
		(user: InternalUser | ExternalUser) => {
			if (currentTaskIndex !== null && formRef.current) {
				const { setFieldValue } = formRef.current;
				setFieldValue(`tasks[${currentTaskIndex}].responsible_id`, user.id);
				setFieldValue(
					`tasks[${currentTaskIndex}].responsible_name`,
					user.full_name
				);
			}
			handleCloseModalUser();
		},
		[currentTaskIndex, handleCloseModalUser]
	);

	const handleSubmit = useCallback(
		async (values: any, { setSubmitting }: any) => {
			setIsSaving(true);
			try {
				if (protocolData) {
					for (const task of values.tasks) {
						await createTask({
							protocolId,
							data: { ...task, deadline: values.deadline },
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
		},
		[protocolData, protocolId, createTask, onClose]
	);

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
				{({ values, isSubmitting }) => (
					<Form className="mt-14 text-xl font-bold text-mainPurple text-center">
						<div className="h-[20rem] grid grid-cols-2 gap-4 mb-4 overflow-y-auto">
							<div>
								<h2 className="mb-2">Задача</h2>
								<FieldArray name="tasks">
									{({ push }) => (
										<div className="flex flex-col gap-3">
											{values.tasks.map((_, index) => (
												<div key={index}>
													<Field
														name={`tasks[${index}].essence`}
														className="text-base bg-lightPurple w-[98%] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
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
										<div className="flex flex-col gap-3">
											{values.tasks.map((task, index) => (
												<div key={index}>
													<Field
														name={`tasks[${index}].responsible_name`}
														className="text-base bg-lightPurple w-[98%] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent cursor-pointer "
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
			{backendError && (
				<div className="text-crimsonRed mt-4">
					Ошибка:{" "}
					{(backendError as any)?.data?.message ||
						"Произошла ошибка при сохранении задачи"}
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

export default React.memo(ProtocolTaskAddModal);
