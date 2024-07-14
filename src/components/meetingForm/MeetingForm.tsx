import { useState, useEffect, ChangeEvent } from "react";

import { ReactComponent as Delete } from "@assets/icons/delete.svg";
import { ReactComponent as Mp4Icon } from "@assets/icons/mp4-icon.svg";

import dayjs from "dayjs";
import classNames from "classnames";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

import {
	useCreateMeetingMutation,
	useUpdateMeetingMutation,
} from "@/api/meetingsApi";

import {
	CreateMeeting,
	Meeting,
	UpdateMeetingMember,
} from "@/shared/interfaces/meeting";
import { FormValues } from "@/shared/interfaces/user";

interface ExtendedUpdateMeetingMember extends UpdateMeetingMember {
	full_name: string;
	email: string;
	email_sent: boolean;
}
interface MeetingFormProps {
	meeting: Meeting | null;
	selectedDate: Date | null;
	startTime: string | null;
	endTime: string | null;
	onSave: (meeting: CreateMeeting) => void;
	onOpenUserModal: () => void;
}

const validationSchema = Yup.object({
	theme: Yup.string().required("Тема обязательна для заполнения"),
	link: Yup.string()
		.url("Некорректная ссылка")
		.required("Ссылка обязательна для заполнения"),
});

const MeetingForm = ({
	meeting,
	selectedDate,
	startTime,
	endTime,
	onSave,
	onOpenUserModal,
}: MeetingFormProps) => {
	const [members, setMembers] = useState<ExtendedUpdateMeetingMember[]>([]);
	const [fileName, setFileName] = useState<string | null>(null);
	const [fileURL, setFileURL] = useState<string | null>(null);

	const [createMeeting, { isLoading: isCreating, error: createError }] =
		useCreateMeetingMutation();
	const [updateMeeting, { isLoading: isUpdating, error: updateError }] =
		useUpdateMeetingMutation();

	const isSubmitting = isCreating || isUpdating;
	const error = createError || updateError;

	const initialValues: Pick<FormValues, "theme" | "link"> = {
		theme: meeting?.theme || "",
		link: meeting?.link || "",
	};

	useEffect(() => {
		if (meeting) {
			setMembers(
				meeting.members?.map((m) => ({
					member_id: m.member.id!,
					should_notify: m.email_sent || m.should_notify,
					full_name: m.member.full_name,
					email: m.member.email,
					email_sent: m.email_sent ?? false,
				})) || []
			);
			if (meeting.document_url) {
				setFileURL(meeting.document_url);
				const fileNameParts = meeting.document_url.split("/");
				setFileName(fileNameParts[fileNameParts.length - 1]);
			} else {
				setFileURL(null);
				setFileName(null);
			}
		} else {
			setMembers([]);
			setFileURL(null);
			setFileName(null);
		}
	}, [meeting]);

	const handleSubmit = async (
		values: Pick<FormValues, "theme" | "link">,
		{ setSubmitting }: FormikHelpers<Pick<FormValues, "theme" | "link">>
	) => {
		const data = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			if (value) data.append(key, value as string);
		});

		data.append("event_date", dayjs(selectedDate).format("YYYY-MM-DD"));
		data.append("event_start_time", startTime || "");
		data.append("event_end_time", endTime || "");

		members.forEach((member, index) => {
			data.append(`members[${index}][member_id]`, member.member_id.toString());
			data.append(
				`members[${index}][should_notify]`,
				member.should_notify ? "1" : "0"
			);
		});

		if (fileURL) {
			const response = await fetch(fileURL);
			const blob = await response.blob();
			data.append("document", blob, fileName || "document");
		}

		const newMeeting: CreateMeeting = {
			theme: values.theme || "",
			link: values.link || "",
			event_date: dayjs(selectedDate).format("YYYY-MM-DD"),
			event_start_time: startTime || "",
			event_end_time: endTime || "",
			members:
				members.length > 0
					? members.map(
							({ member_id, should_notify, full_name, email, email_sent }) => ({
								id: member_id,
								member: { id: member_id, full_name, email },
								email_sent,
								should_notify: should_notify ?? false,
							})
					  )
					: [],
			document: fileURL || undefined,
		};

		try {
			if (meeting?.id) {
				data.append("_method", "PUT");
				await updateMeeting({ id: meeting.id, data }).unwrap();
			} else {
				await createMeeting({ data }).unwrap();
			}
			onSave(newMeeting);
		} catch (error: unknown) {
			console.error("Failed to save meeting: ", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFileName(file.name);
			const fileReader = new FileReader();
			fileReader.onload = (e) => setFileURL(e.target?.result as string);
			fileReader.readAsDataURL(file);
		}
	};

	const handleCheckboxChange = (id: number) => {
		setMembers((prevMembers) =>
			prevMembers.map((member) =>
				member.member_id === id
					? { ...member, should_notify: !member.should_notify }
					: member
			)
		);
	};

	const handleDeleteMember = (id: number) => {
		setMembers((prevMembers) =>
			prevMembers.filter((member) => member.member_id !== id)
		);
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			enableReinitialize
		>
			{({ setFieldValue }) => (
				<Form>
					<div className="flex flex-col gap-3 mt-5">
						<div className="flex flex-col gap-2">
							<Field
								className={classNames(
									"w-full text-mainPurple text-sm bg-white p-3 rounded-lg outline-none ring-2 focus:bg-lightPurple focus:ring-mainPurple border-transparent ring-mainPurple",
									{ "bg-gray-200 opacity-50": isSubmitting }
								)}
								id="theme"
								name="theme"
								placeholder="Введите тему совещания"
								disabled={isSubmitting}
							/>
							<ErrorMessage
								name="theme"
								component="div"
								className="text-crimsonRed text-sm font-bold"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Field
								className={classNames(
									"w-full text-mainPurple text-sm bg-white p-3 rounded-lg outline-none ring-2 focus:bg-lightPurple focus:ring-mainPurple border-transparent ring-mainPurple",
									{ "bg-gray-200 opacity-50": isSubmitting }
								)}
								id="link"
								name="link"
								placeholder="Вставьте ссылку на совещание"
								disabled={isSubmitting}
							/>
							<ErrorMessage
								name="link"
								component="div"
								className="text-crimsonRed text-sm font-bold"
							/>
						</div>
					</div>
					<div className="mt-2 px-3 py-4 border-2 border-mainPurple rounded-lg">
						<div className="justify-between flex items-center">
							<span className="font-bold text-lg text-start text-gardenGreen">
								Участники
							</span>
							<button
								type="button"
								className="bg-gardenGreen font-bold text-xl rounded-md text-white p-2 leading-none"
								onClick={onOpenUserModal}
								disabled={isSubmitting}
							>
								+
							</button>
						</div>
						<ul className="flex flex-col gap-1 mt-2 max-h-[9rem] overflow-y-auto">
							{members.map((member) => (
								<li
									key={member.member_id}
									className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-between gap-2"
								>
									<div className="flex items-center space-x-2">
										<Delete
											className="w-6 h-6 fill-current text-crimsonRed hover:text-crimsonRed cursor-pointer"
											onClick={() => handleDeleteMember(member.member_id)}
										/>
										<span className="text-[12px] font-bold text-mainPurple">
											{member.full_name}
										</span>
										<span className="text-[10px] text-gray-400">
											{member.email}
										</span>
									</div>
									<div className="flex items-center gap-2">
										{member.email && (
											<input
												type="checkbox"
												name="checkbox"
												id="checkbox"
												className="w-7 h-7 border-2 cursor-pointer"
												checked={!!member.should_notify}
												onChange={() => handleCheckboxChange(member.member_id)}
												disabled={member.email_sent}
											/>
										)}
									</div>
								</li>
							))}
						</ul>
					</div>
					<div className="flex justify-start mt-3">
						<div className="flex flex-col items-start">
							<label
								htmlFor="document"
								className="bg-gardenGreen text-white font-bold text-xs rounded-md px-5 py-2 cursor-pointer hover:bg-gardenGreenHover"
							>
								Загрузить документ
								<input
									id="document"
									name="document"
									type="file"
									accept=".pdf,.doc,.docx"
									className="hidden"
									onChange={(event) => {
										handleFileChange(event);
										const file = event.target.files?.[0];
										if (file) {
											setFieldValue("document", file);
										}
									}}
									disabled={isSubmitting}
								/>
							</label>
							{fileName && (
								<div className="mt-2 flex flex-wrap items-center text-gray-400 gap-2 font-normal text-xs px-2">
									<Mp4Icon className="w-5 h-5" />
									<a
										href={fileURL ?? "#"}
										target="_blank"
										rel="noopener noreferrer"
										className="text-black hover:underline"
									>
										{fileName}
									</a>
								</div>
							)}
							<ErrorMessage
								name="document"
								component="div"
								className="text-crimsonRed text-sm mt-2"
							/>
						</div>
					</div>
					<div className="flex justify-center mt-3">
						<button
							type="submit"
							className={classNames(
								"rounded-xl px-14 py-2 bg-mainPurple text-white text-lg font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive",
								{ "bg-gray-200 opacity-50 cursor-not-allowed": isSubmitting }
							)}
							disabled={isSubmitting}
						>
							Сохранить
						</button>
					</div>
					{error && (
						<div className="mt-4 text-crimsonRed text-xs text-end font-bold">
							Произошла ошибка при сохранении данных
						</div>
					)}
				</Form>
			)}
		</Formik>
	);
};

export default MeetingForm;
