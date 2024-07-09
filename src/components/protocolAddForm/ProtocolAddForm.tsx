import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Backward } from "@assets/icons/backward.svg";
import { ReactComponent as FileUploadIcon } from "@assets/icons/file-upload-icon.svg";
import { ReactComponent as Mp4Icon } from "@assets/icons/mp4-icon.svg";

import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";

import Calendar from "../calendar/Calendar";
import ExternalUserAddModal from "../externalUserAddModal/ExternalUserAddModal";

import {
	handleDragOver,
	handleDragLeave,
	handleDrop,
} from "@/utils/videoFileHandlers";

import { useCreateProtocolMutation } from "@/api/protocolsApi";

import { ExternalUser, InternalUser } from "@/shared/interfaces/user";

const ProtocolAddForm = () => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpenUser, setIsModalOpenUser] = useState<boolean>(false);
	const [isSelectingFor, setIsSelectingFor] = useState<
		"secretary" | "director" | null
	>(null);
	const [createProtocol] = useCreateProtocolMutation();

	const formik = useFormik({
		initialValues: {
			theme: "",
			agenda: "",
			secretary_id: "",
			secretaryName: "",
			director_id: "",
			directorName: "",
			eventDate: new Date(),
			video: "",
		},
		validationSchema: Yup.object({
			theme: Yup.string().required("Обязательное поле"),
			agenda: Yup.string().required("Обязательное поле"),
			secretary_id: Yup.number().required("Обязательное поле"),
			director_id: Yup.number().required("Обязательное поле"),
			eventDate: Yup.string().required("Обязательное поле"),
		}),
		onSubmit: async (values) => {
			const formData = new FormData();
			formData.append("theme", values.theme);
			formData.append("agenda", values.agenda);
			formData.append("secretary_id", values.secretary_id.toString());
			formData.append("director_id", values.director_id.toString());
			const formattedDate = dayjs(values.eventDate).format("YYYY-MM-DD");
			formData.append("event_date", formattedDate);
			if (file) {
				formData.append("video", file);
			} else {
				setError("Поле video должно быть файлом.");
				return;
			}

			try {
				const response = await createProtocol(formData).unwrap();
				console.log("Success:", response);
				// Дополнительные действия после успешного создания протокола
			} catch (error) {
				console.error("Error:", error);
			}
		},
	});

	const handleOpenModalUser = (field: "secretary" | "director") => {
		setIsSelectingFor(field);
		setIsModalOpenUser(true);
	};

	const handleCloseModalUser = () => {
		setIsModalOpenUser(false);
		setIsSelectingFor(null);
	};

	const handleUserSelect = (user: InternalUser | ExternalUser) => {
		formik.setFieldValue(
			isSelectingFor! === "secretary" ? "secretary_id" : "director_id",
			user.id
		);
		formik.setFieldValue(
			isSelectingFor! === "secretary" ? "secretaryName" : "directorName",
			user.full_name
		);
		handleCloseModalUser();
	};

	const handleDateChange = (date: Date) => {
		formik.setFieldValue("eventDate", date);
	};

	const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedFile = e.currentTarget.files
			? e.currentTarget.files[0]
			: null;
		setFile(uploadedFile);
		if (uploadedFile) {
			formik.setFieldValue("video", uploadedFile.name);
			setError(null);
		} else {
			formik.setFieldValue("video", "");
			setError("Поле video должно быть файлом.");
		}
	};

	const navigate = useNavigate();
	return (
		<div className="w-full mx-5 mt-7">
			<div className="font-bold text-mainPurple text-2xl py-3 px-7 rounded-xl bg-gray-100 flex items-center justify-start mb-8">
				<Backward
					className="w-9 h-9 cursor-pointer fill-current text-mainPurple hover:text-mainPurpleHover active:text-mainPurpleActive"
					onClick={() => navigate(-1)}
				/>
				<h1 className="mx-auto text-center">Добавление протокола</h1>
			</div>

			<form
				onSubmit={formik.handleSubmit}
				className="w-full grid grid-cols-2   gap-5"
			>
				<div className=" w-full flex flex-col items-center xl:text-xl lg:text-lg font-bold text-mainPurple gap-8">
					<div className="flex flex-col items-center w-full">
						<label className="mb-2" htmlFor="theme">
							Тема
						</label>
						<input
							className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="theme"
							type="text"
							value={formik.values.theme}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.theme && formik.errors.theme ? (
							<div className="text-red-500 text-sm">{formik.errors.theme}</div>
						) : null}
					</div>
					<div className="flex flex-col items-center w-full">
						<label className="mb-2" htmlFor="agenda">
							Повестка
						</label>
						<input
							className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="agenda"
							type="text"
							value={formik.values.agenda}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.agenda && formik.errors.agenda ? (
							<div className="text-red-500 text-sm">{formik.errors.agenda}</div>
						) : null}
					</div>
					<div className="flex flex-col items-center w-full">
						<label className="mb-2" htmlFor="secretary">
							Секретарь
						</label>
						<input
							className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent cursor-pointer"
							id="secretary"
							type="text"
							value={formik.values.secretaryName}
							onClick={() => handleOpenModalUser("secretary")}
							readOnly
						/>
						{formik.touched.secretary_id && formik.errors.secretary_id ? (
							<div className="text-red-500 text-sm">
								{formik.errors.secretary_id}
							</div>
						) : null}
					</div>
					<div className="flex flex-col items-center w-full ">
						<label className="mb-2" htmlFor="director">
							Председатель
						</label>
						<input
							className="w-full px-3 py-4 bg-lightPurple rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
							id="director"
							type="text"
							value={formik.values.directorName}
							onClick={() => handleOpenModalUser("director")}
							readOnly
						/>
						{formik.touched.director_id && formik.errors.director_id ? (
							<div className="text-red-500 text-sm">
								{formik.errors.director_id}
							</div>
						) : null}
					</div>
				</div>
				<div className="flex flex-col gap-6 font-bold text-lg text-mainPurple text-center">
					<div className="flex flex-col items-center w-full">
						<label className="mb-2" htmlFor="eventDate">
							Дата
						</label>
						<div className="max-w-lg rounded-xl p-4 flex justify-center items-center">
							<Calendar
								onChange={handleDateChange}
								value={formik.values.eventDate}
								showMeetingDots={false}
							/>
						</div>

						<input
							id="eventDate"
							type="hidden"
							{...formik.getFieldProps("eventDate")}
						/>
					</div>
					<div className="flex flex-col items-center w-full">
						<h2 className="mb-2 text-mainPurple font-bold">
							Прикрепить файл совещания
						</h2>
						<label
							htmlFor="file-upload"
							className={`flex flex-shrink-0 flex-grow bg-custom-gradient cursor-pointer justify-center gap-4 items-center py-3 px-3 border rounded-lg border-mainPurple ${
								isDragging ? "bg-gray-200" : ""
							}`}
							onDragOver={(e) => handleDragOver(e, setIsDragging)}
							onDragLeave={(e) => handleDragLeave(e, setIsDragging)}
							onDrop={(e) => handleDrop(e, setFile, setIsDragging, setError)}
						>
							<FileUploadIcon className="w-10 h-10" />
							<p className="text-xs text-start font-normal text-black">
								Выберите файл или перетащите сюда
							</p>
						</label>
						<input
							id="file-upload"
							type="file"
							className="hidden"
							onChange={handleFileUploadChange}
						/>

						{file && (
							<div className="mt-2 flex items-center text-gray-400 gap-2 font-normal text-xs px-2">
								<Mp4Icon className="w-5 h-5" />
								<span className="text-black">{file.name}</span>
							</div>
						)}

						{formik.touched.video && formik.errors.video ? (
							<div className="text-red-500 text-sm">{formik.errors.video}</div>
						) : null}

						{error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
					</div>
				</div>
				<div className="flex justify-center w-full">
					<button
						type="submit"
						className=" px-10 text-lg  p-2 rounded-lg bg-mainPurple text-white font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive"
					>
						Создать протокол
					</button>
				</div>
			</form>

			{isModalOpenUser && (
				<ExternalUserAddModal
					onClose={handleCloseModalUser}
					onUserSelect={handleUserSelect}
				/>
			)}
		</div>
	);
};

export default ProtocolAddForm;
