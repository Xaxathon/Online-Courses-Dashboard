import { useRef, useEffect, DragEvent, TextareaHTMLAttributes } from "react";

import { ReactComponent as DragAndDropIcon } from "@assets/icons/drag-and-drop-icon.svg";

import Modal from "../modal/Modal";

import {
	Formik,
	Form,
	Field,
	ErrorMessage,
	FieldInputProps,
	FormikProps,
} from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import dayjs from "dayjs";

import { useSaveFinalProtocolMutation } from "@/api/protocolsApi";

interface ProtocolKeyword {
	key: string;
	value: string;
}

interface FormValues {
	event_start_time: string;
	city: string;
	location: string;
	keywords: ProtocolKeyword[];
}

interface ProtocolTextModalProps {
	final_transcript: ProtocolKeyword[];
	protocolId: number;
	location: string;
	city: string;
	event_start_time: string;
	onClose: () => void;
}

interface AutoResizeTextAreaProps
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "form"> {
	field: FieldInputProps<string>;
	form: FormikProps<FormValues>;
}

const ProtocolTextModal = ({
	onClose,
	final_transcript,
	protocolId,
	location,
	city,
	event_start_time,
}: ProtocolTextModalProps) => {
	const [saveFinalProtocol] = useSaveFinalProtocolMutation();

	const formatTime = (time: string) => {
		return dayjs(time).format("HH:mm");
	};

	const initialValues: FormValues = {
		event_start_time: event_start_time ? formatTime(event_start_time) : "",
		city: city || "",
		location: location || "",
		keywords: final_transcript.filter((keyword) => keyword.key.trim() !== ""),
	};

	const validationSchema = Yup.object({
		event_start_time: Yup.string()
			.matches(
				/^([01]\d|2[0-3]):([0-5]\d)$/,
				"Время должно быть в формате ЧЧ:ММ"
			)
			.required("Обязательное поле"),
		city: Yup.string().required("Обязательное поле"),
		location: Yup.string().required("Обязательное поле"),
	});

	const handleSubmit = async (
		values: FormValues,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		try {
			await saveFinalProtocol({
				id: protocolId,
				data: {
					final_transcript: values.keywords,
					location: values.location,
					city: values.city,
					event_start_time: dayjs(
						`2000-01-01 ${values.event_start_time}`
					).format("HH:mm"),
				},
			}).unwrap();

			onClose();
		} catch (error) {
			console.error("Failed to save final protocol:", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal onClose={onClose}>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ values, setFieldValue, isSubmitting }) => {
					const onDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
						e.dataTransfer.setData("text/plain", index.toString());
					};

					const onDragOver = (e: DragEvent<HTMLDivElement>) => {
						e.preventDefault();
					};

					const onDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
						e.preventDefault();
						const dragIndex = parseInt(
							e.dataTransfer.getData("text/plain"),
							10
						);
						if (dragIndex === dropIndex) return;

						const newKeywords = [...values.keywords];
						const [removed] = newKeywords.splice(dragIndex, 1);
						newKeywords.splice(dropIndex, 0, removed);

						setFieldValue("keywords", newKeywords);
					};

					return (
						<Form className="w-[35rem] flex flex-col gap-2 mt-6 text-base font-bold text-mainPurple">
							<h2 className="text-center mb-2 text-xl">Текст протокола</h2>
							<div className="h-[30rem] w-full p-1 overflow-y-auto">
								{values.keywords.map((keyword, index) => (
									<DraggableKeyword
										key={`${keyword.key}-${index}`}
										keyword={keyword}
										index={index}
										onDragStart={onDragStart}
										onDragOver={onDragOver}
										onDrop={onDrop}
									/>
								))}

								<div className="flex gap-4 mt-4">
									<div className="flex flex-col gap-1 flex-1">
										<label htmlFor="event_start_time">Время начала</label>
										<Field
											type="time"
											id="event_start_time"
											name="event_start_time"
											className="text-mainPurple bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
										/>
										<ErrorMessage
											name="event_start_time"
											component="div"
											className="text-crimsonRed"
										/>
									</div>

									<div className="flex flex-col gap-1 flex-1">
										<label htmlFor="city">Город</label>
										<Field
											type="text"
											id="city"
											name="city"
											className="text-mainPurple bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
										/>
										<ErrorMessage
											name="city"
											component="div"
											className="text-crimsonRed"
										/>
									</div>
								</div>

								<div className="flex flex-col gap-1 mt-4">
									<label htmlFor="location">Место проведения</label>
									<Field
										type="text"
										id="location"
										name="location"
										className="text-mainPurple bg-lightPurple p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
									/>
									<ErrorMessage
										name="location"
										component="div"
										className="text-crimsonRed"
									/>
								</div>
							</div>

							<button
								className={classNames(
									"px-20 mt-5 py-2 mx-auto text-white rounded-lg text-base",
									{
										"bg-gray-500 cursor-not-allowed": isSubmitting,
										"bg-mainPurple hover:bg-mainPurpleHover active:bg-mainPurpleActive":
											!isSubmitting,
									}
								)}
								type="submit"
								disabled={isSubmitting}
							>
								Сохранить
							</button>
						</Form>
					);
				}}
			</Formik>
		</Modal>
	);
};

export default ProtocolTextModal;

const DraggableKeyword = ({
	keyword,
	index,
	onDragStart,
	onDragOver,
	onDrop,
}: {
	keyword: ProtocolKeyword;
	index: number;
	onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
	onDragOver: (e: DragEvent<HTMLDivElement>) => void;
	onDrop: (e: DragEvent<HTMLDivElement>, index: number) => void;
}) => {
	return (
		<div
			draggable
			onDragStart={(e) => onDragStart(e, index)}
			onDragOver={onDragOver}
			onDrop={(e) => onDrop(e, index)}
			className="mb-2 cursor-move"
		>
			<div className="flex flex-col gap-1 w-full p-2 rounded-lg bg-white">
				<div className="flex items-center gap-2">
					<DragAndDropIcon className="h-5 w-5 fill-current text-gray-400 hover:text-gray-700 active:text-mainPurple" />
					<label htmlFor={`keywords.${index}.value`} className="flex-grow">
						{keyword.key}
					</label>
				</div>
				<Field
					component={AutoResizeTextArea}
					id={`keywords.${index}.value`}
					name={`keywords.${index}.value`}
					className="min-h-7 max-h-28"
				/>
			</div>
		</div>
	);
};

const AutoResizeTextArea = ({
	field,
	form,
	...props
}: AutoResizeTextAreaProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			const scrollHeight = textareaRef.current.scrollHeight;
			const minHeight = 1.75;
			const maxHeight = 7;
			const newHeight = Math.max(
				Math.min(scrollHeight / 16, maxHeight),
				minHeight
			);
			textareaRef.current.style.height = `${newHeight}rem`;
		}
	}, [field.value]);

	return (
		<textarea
			{...field}
			{...props}
			value={field.value || ""}
			ref={textareaRef}
			className={`text-mainPurple bg-lightPurple p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent resize-none ${props.className}`}
		/>
	);
};
