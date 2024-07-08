import React from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import Modal from "../modal/Modal";

interface AppointmentTimeAddFormModalProps {
	onClose: () => void;
	onTimeSubmit: (start: string, end: string) => void;
}

const AppointmentTimeAddFormModal: React.FC<
	AppointmentTimeAddFormModalProps
> = ({ onClose, onTimeSubmit }) => {
	const validationSchema = Yup.object({
		startTime: Yup.string().required("Время начала обязательно для заполнения"),
		endTime: Yup.string().required(
			"Время окончания обязательно для заполнения"
		),
	});

	return (
		<Modal onClose={onClose}>
			<div className="mt-14 w-[30rem] text-xl font-bold text-mainPurple text-center">
				<span>Добавление совещания</span>
				<Formik
					initialValues={{ startTime: "", endTime: "" }}
					validationSchema={validationSchema}
					onSubmit={(values, { resetForm }) => {
						onTimeSubmit(values.startTime, values.endTime);
						resetForm();
					}}
				>
					{({ isSubmitting }) => (
						<Form className="px-10 mt-10">
							<div className="flex items-center justify-center gap-10 p-4 rounded-lg bg-mainPurple">
								<div>
									<Field
										type="time"
										name="startTime"
										className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
									<ErrorMessage
										name="startTime"
										component="div"
										className="text-crimsonRed text-sm mt-1"
									/>
								</div>
								<span className="text-white">&rarr;</span>
								<div>
									<Field
										type="time"
										name="endTime"
										className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
									<ErrorMessage
										name="endTime"
										component="div"
										className="text-crimsonRed text-sm mt-1"
									/>
								</div>
							</div>
							<button
								type="submit"
								className="mt-20 bg-mainPurple text-white rounded-lg px-5 py-2 font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive"
								disabled={isSubmitting}
							>
								Создать
							</button>
						</Form>
					)}
				</Formik>
			</div>
		</Modal>
	);
};

export default AppointmentTimeAddFormModal;
