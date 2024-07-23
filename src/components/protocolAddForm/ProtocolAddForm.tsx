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

import { ReactComponent as Spinner } from "../../assets/icons/spinner.svg";

import {
	handleDragOver,
	handleDragLeave,
	handleDrop,
	handleFileChange,
	allowedFileTypes,
} from "@/utils/videoFileHandlers";

import { useCreateProtocolMutation } from "@/api/protocolsApi";

import { ExternalUser, InternalUser } from "@/shared/interfaces/user";
import Portal from "../portal/Portal";

const ProtocolAddForm = () => {
	const navigate = useNavigate();

	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [fileError, setFileError] = useState<string | null>(null);

	const [isModalOpenUser, setIsModalOpenUser] = useState<boolean>(false);
	const [isSelectingFor, setIsSelectingFor] = useState<
		"secretary" | "director" | null
	>(null);

	const [createProtocol, { isLoading, isError }] = useCreateProtocolMutation();

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
			theme: Yup.string().required("Поле обязательно для заполнения"),
			agenda: Yup.string().required("Поле обязательно для заполнения"),
			secretary_id: Yup.number().required("Поле обязательно для заполнения"),
			director_id: Yup.number().required("Поле обязательно для заполнения"),
			eventDate: Yup.string().required("Поле обязательно для заполнения"),
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
				setFileError("Поле video должно быть файлом.");
				return;
			}

			try {
				await createProtocol(formData).unwrap();
				navigate("/main/protocols");
			} catch (error) {
				console.error("Ошибка:", error);
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
	};

	const handleDateChange = (date: Date) => {
		formik.setFieldValue("eventDate", date);
	};

	const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleFileChange(e, setFile, setFileError);
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			formik.setFieldValue("video", e.currentTarget.files[0].name);
		} else {
			formik.setFieldValue("video", "");
		}
	};

	return (
		<div className="w-full mx-5 mt-7">
			{isLoading && <ProtocolLoadingView />}
			<div className="font-bold text-mainPurple text-2xl py-3 px-7 rounded-xl bg-gray-100 flex items-center justify-start mb-8">
				<Backward
					className="w-9 h-9 cursor-pointer fill-current text-mainPurple hover:text-mainPurpleHover active:text-mainPurpleActive"
					onClick={() => navigate(-1)}
				/>
				<h1 className="mx-auto text-center">Добавление протокола</h1>
			</div>

			<form
				onSubmit={formik.handleSubmit}
				className="w-full grid grid-cols-2 gap-5"
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
							<div className="text-crimsonRed text-sm">
								{formik.errors.theme}
							</div>
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
							<div className="text-crimsonRed text-sm">
								{formik.errors.agenda}
							</div>
						) : null}
					</div>
					<div className="flex flex-col items-center w-full">
						<label className="mb-2" htmlFor="secretary">
							Секретарь
						</label>
						<input
							className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent cursor-pointer hover:bg-lightPurpleHover transition-colors duration-200 ease-in-out"
							id="secretary"
							type="text"
							value={formik.values.secretaryName}
							onClick={() => handleOpenModalUser("secretary")}
							readOnly
						/>
						{formik.touched.secretary_id && formik.errors.secretary_id ? (
							<div className="text-crimsonRed text-sm">
								{formik.errors.secretary_id}
							</div>
						) : null}
					</div>
					<div className="flex flex-col items-center w-full ">
						<label className="mb-2" htmlFor="director">
							Председатель
						</label>
						<input
							className="w-full px-3 py-4 bg-lightPurple rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent hover:bg-lightPurpleHover transition-colors duration-200 ease-in-out"
							id="director"
							type="text"
							value={formik.values.directorName}
							onClick={() => handleOpenModalUser("director")}
							readOnly
						/>
						{formik.touched.director_id && formik.errors.director_id ? (
							<div className="text-crimsonRed text-sm">
								{formik.errors.director_id}
							</div>
						) : null}
					</div>
				</div>
				<div className="flex flex-col gap-6 font-bold text-lg text-mainPurple text-center">
					<div className="flex flex-col items-center w-full">
						<label htmlFor="eventDate">Дата</label>
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
							className={`flex flex-shrink-0 flex-grow bg-custom-gradient cursor-pointer justify-center gap-4 items-center py-3 px-3 border rounded-lg border-mainPurple hover:border-gardenGreen ${
								isDragging ? "bg-gray-200" : ""
							}`}
							onDragOver={(e) => handleDragOver(e, setIsDragging)}
							onDragLeave={(e) => handleDragLeave(e, setIsDragging)}
							onDrop={(e) =>
								handleDrop(e, setFile, setIsDragging, setFileError)
							}
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
							accept={allowedFileTypes.join(",")}
						/>

						{file && (
							<div className="mt-2 flex items-center text-gray-400 gap-2 font-normal text-xs px-2">
								<Mp4Icon className="w-5 h-5" />
								<span className="text-black">{file.name}</span>
							</div>
						)}

						{formik.touched.video && formik.errors.video ? (
							<div className="text-crimsonRed text-sm">
								{formik.errors.video}
							</div>
						) : null}

						{fileError && (
							<div className="mt-2 text-crimsonRed text-sm">{fileError}</div>
						)}
					</div>
				</div>
				<div className="flex justify-center w-full">
					<button
						type="submit"
						className=" px-10 text-lg  p-2 rounded-lg bg-mainPurple text-white font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive"
						disabled={isLoading}
					>
						{isLoading ? "Создание..." : "Создать протокол"}
					</button>
				</div>
				{isError && (
					<span className="block mx-auto mt-2 text-crimsonRed text-sm">
						Произошла ошибка при создании протокола
					</span>
				)}
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

const ProtocolLoadingView = () => {
	return (
		<Portal>
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
				<div className="flex flex-col items-center justify-center bg-white p-5 rounded-lg shadow-custom text-center">
					<Spinner className="w-10 h-10 mb-3 animate-spin" />
					<p className="text-lg font-semibold mb-1">Загружается видео...</p>
					<p className="text-sm text-gray-600">
						Пожалуйста, подождите. Это может занять некоторое время.
					</p>
				</div>
			</div>
		</Portal>
	);
};
