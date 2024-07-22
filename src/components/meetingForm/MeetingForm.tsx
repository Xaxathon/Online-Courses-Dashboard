import { useState, useEffect, ChangeEvent } from "react";

import { ReactComponent as Delete } from "@assets/icons/delete.svg";
import { ReactComponent as Mp4Icon } from "@assets/icons/mp4-icon.svg";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import classNames from "classnames";

import {
	useCreateMeetingMutation,
	useUpdateMeetingMutation,
} from "@/api/meetingsApi";

import {
	CreateMeeting,
	Meeting,
	UpdateMeetingMember,
} from "@/shared/interfaces/meeting";

interface ExtendedUpdateMeetingMember extends UpdateMeetingMember {
	full_name: string;
	email: string;
	email_sent: boolean;
}

interface MeetingFormProps {
	meeting: Meeting | null;
	errorAddMember: string | null;
	selectedDate: Date | null;
	startTime: string | null;
	endTime: string | null;
	onSave: (meeting: CreateMeeting) => void;
	onOpenUserModal: () => void;
	onUpdateMeeting: (updatedMeeting: Meeting) => void;
}

interface FormValues {
	theme: string;
	link: string;
	file: {
		name: string | null;
		url: string | null;
	};
}

const validationSchema = Yup.object({
	theme: Yup.string().required("Поле обязательно для заполнения"),
	link: Yup.string()
		.url("Некорректная ссылка")
		.required("Поле обязательно для заполнения"),
	file: Yup.object({
		name: Yup.string().nullable(),
		url: Yup.string().nullable(),
	}),
});

const MeetingForm = ({
	meeting,
	errorAddMember,
	selectedDate,
	startTime,
	endTime,
	onSave,
	onOpenUserModal,
	onUpdateMeeting,
}: MeetingFormProps) => {
	const [members, setMembers] = useState<ExtendedUpdateMeetingMember[]>([]);

	const [createMeeting, { isLoading: isCreating, error: createError }] =
		useCreateMeetingMutation();
	const [updateMeeting, { isLoading: isUpdating, error: updateError }] =
		useUpdateMeetingMutation();

	const isSubmitting = isCreating || isUpdating;
	const error = createError || updateError;

	const initialValues: FormValues = {
		theme: meeting?.theme || "",
		link: meeting?.link || "",
		file: {
			name: meeting?.document_url
				? meeting.document_url.split("/").pop() || null
				: null,
			url: meeting?.document_url || null,
		},
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
		} else {
			setMembers([]);
		}
	}, [meeting]);

	const handleSubmit = async (
		values: FormValues,
		{ setSubmitting }: FormikHelpers<FormValues>
	) => {
		const data = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			if (value && key !== "file") data.append(key, value as string);
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

		if (values.file.url) {
			const response = await fetch(values.file.url);
			const blob = await response.blob();
			data.append("document", blob, values.file.name || "document");
		}

		try {
			if (meeting?.id) {
				data.append("_method", "PUT");
				await updateMeeting({ id: meeting.id, data }).unwrap();
			} else {
				await createMeeting({ data }).unwrap();
			}
			onSave(values as unknown as CreateMeeting);
		} catch (error: unknown) {
			console.error("Failed to save meeting: ", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleFileChange = (
		event: ChangeEvent<HTMLInputElement>,
		setFieldValue: (field: string, value: any) => void
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const fileReader = new FileReader();
			fileReader.onload = (e) => {
				setFieldValue("file", {
					name: file.name,
					url: e.target?.result as string,
				});
			};
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
		if (meeting && meeting.members) {
			const updatedMembers = meeting.members.filter(
				(member) => member.member.id !== id
			);
			const updatedMeeting = { ...meeting, members: updatedMembers };
			onUpdateMeeting(updatedMeeting);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
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
								className="bg-gardenGreen font-bold text-xl rounded-md text-white p-2 leading-none hover:bg-gardenGreenHover"
								onClick={onOpenUserModal}
								disabled={isSubmitting}
							>
								+
							</button>
						</div>
						<ul className="flex flex-col gap-1 mt-2 max-h-[9rem] overflow-y-auto">
							{errorAddMember && (
								<li className="bg-red-100 border border-red-400 text-crimsonRed text-xs rounded-sm px-3 py-1 flex items-center justify-between gap-2">
									{errorAddMember}
								</li>
							)}
							{members.map((member) => (
								<li
									key={member.member_id}
									className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-between gap-2"
								>
									<div className="flex items-center space-x-2">
										<Delete
											className="w-6 h-6 fill-current text-gray-400 hover:text-crimsonRed cursor-pointer"
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
												className={classNames("w-7 h-7 border-2", {
													"cursor-not-allowed": member.email_sent,
													"cursor-pointer": !member.email_sent,
												})}
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
								className={classNames(
									"text-white font-bold text-xs rounded-md px-5 py-2 cursor-pointer",
									{
										"bg-gardenGreen hover:bg-gardenGreenHover":
											!values.file || !values.file.name,
										"bg-gardenGreenHover": values.file && values.file.name,
									}
								)}
							>
								{values.file && values.file.name
									? "Документ загружен"
									: "Загрузить документ"}
								<input
									id="document"
									name="document"
									type="file"
									accept=".pdf,.doc,.docx"
									className="hidden"
									onChange={(event) => handleFileChange(event, setFieldValue)}
									disabled={isSubmitting}
								/>
							</label>
							{values.file.name && (
								<div className="mt-2 flex flex-wrap items-center text-gray-400 gap-2 font-normal text-xs px-2">
									<Mp4Icon className="w-5 h-5" />
									<a
										href={values.file.url ?? "#"}
										target="_blank"
										rel="noopener noreferrer"
										className="text-black hover:underline"
									>
										{values.file.name}
									</a>
								</div>
							)}
							<ErrorMessage
								name="file"
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
