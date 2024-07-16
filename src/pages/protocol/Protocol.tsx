import { useEffect, useState, FocusEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ReactComponent as Delete } from "@assets/icons/delete.svg";
import { ReactComponent as Backward } from "@assets/icons/backward.svg";

import ProtocolTaskAddModal from "@components/protocolTaskAddModal/ProtocolTaskAddModal";
import DeleteElementModal from "@components/deleteElementModal/DeleteElementModal";
import ProtocolParticipantList from "@components/protocolParticipantList/ProtocolParticipantList";
import ExternalUserAddModal from "@components/externalUserAddModal/ExternalUserAddModal";
import ProtocolTextModal from "@/components/protocolTextModal/ProtocolTextModal";
import Skeleton from "@components/skeleton/Skeleton";

import { useFormik } from "formik";
import * as Yup from "yup";
import ReactPlayer from "react-player";

import {
	handleGeneratePDF,
	handleGenerateDOCX,
} from "@/utils/documentGenerators";

import {
	useGetProtocolQuery,
	useUpdateProtocolMutation,
	useDeleteProtocolMutation,
	useGeneratePDFMutation,
	useGenerateDOCXMutation,
} from "@/api/protocolsApi";

import { ExternalUser, InternalUser } from "@/shared/interfaces/user";
import { ProtocolStage } from "@/shared/interfaces/protocol";

const Protocol = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [shouldFetchProtocol, setShouldFetchProtocol] = useState(true);
	const [isModalOpenUser, setIsModalOpenUser] = useState<boolean>(false);
	const [isModalOpenTask, setIsModalOpenTask] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [isModalOpenText, setIsModalOpenText] = useState<boolean>(false);

	const [isSelectingFor, setIsSelectingFor] = useState<
		"secretary" | "supervisor" | null
	>(null);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

	const [initialValues, setInitialValues] = useState({
		theme: "",
		agenda: "",
		secretary_id: 0,
		secretaryName: "",
		director_id: 0,
		directorName: "",
		status: "process",
	});

	const {
		data: protocol,
		error,
		isLoading,
	} = useGetProtocolQuery(Number(id), {
		skip: !shouldFetchProtocol,
		refetchOnMountOrArgChange: false,
	});
	const [updateProtocol] = useUpdateProtocolMutation();
	const [deleteProtocol] = useDeleteProtocolMutation();

	const [generatePDF] = useGeneratePDFMutation();
	const [generateDOCX] = useGenerateDOCXMutation();

	useEffect(() => {
		if (protocol) {
			setInitialValues({
				theme: protocol.data.theme,
				agenda: protocol.data.agenda,
				secretary_id: protocol.data.secretary.id,
				secretaryName: protocol.data.secretary.full_name,
				director_id: protocol.data.director.id,
				directorName: protocol.data.director.full_name,
				status: protocol.data.status,
			});
			setShouldFetchProtocol(false);
		}
	}, [protocol]);

	const formik = useFormik({
		initialValues: initialValues,
		enableReinitialize: true,
		validationSchema: Yup.object({
			theme: Yup.string().required("Обязательное поле"),
			agenda: Yup.string().required("Обязательное поле"),
		}),
		onSubmit: async (values) => {
			try {
				await updateProtocol({
					id: Number(id),
					data: {
						theme: values.theme,
						agenda: values.agenda,
						secretary_id: values.secretary_id,
						director_id: values.director_id,
					},
				}).unwrap();
				setInitialValues(values);
				setShouldFetchProtocol(true);
			} catch (error) {
				console.error("Error:", error);
			}
		},
	});

	const handleUserSelect = (user: InternalUser | ExternalUser) => {
		if (isSelectingFor === "secretary") {
			formik.setFieldValue("secretary_id", user.id);
			formik.setFieldValue("secretaryName", user.full_name);
		} else if (isSelectingFor === "supervisor") {
			formik.setFieldValue("director_id", user.id);
			formik.setFieldValue("directorName", user.full_name);
		}
		formik.submitForm();
		handleCloseModalUser();
	};

	const handleStatusToggle = async () => {
		if (!protocol) return;
		setIsUpdatingStatus(true);
		try {
			const newStatus =
				initialValues.status === "success" ? "process" : "success";
			await updateProtocol({
				id: Number(id),
				data: { status: newStatus },
			}).unwrap();

			setInitialValues((prev) => ({ ...prev, status: newStatus }));
			setShouldFetchProtocol(true);
		} catch (error) {
			console.error("Status Update Error:", error);
		}
		setIsUpdatingStatus(false);
	};

	const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
		const { name } = e.target;
		const currentValue = formik.values[name as keyof typeof formik.values];
		const initialValue = initialValues[name as keyof typeof initialValues];

		if (currentValue !== initialValue) {
			formik.setFieldTouched(name, true, false);
			await formik.submitForm();
		}
	};

	const handleDelete = async () => {
		try {
			await deleteProtocol(Number(id)).unwrap();
			navigate("/main/protocols");
		} catch (error) {
			console.error("Failed to delete protocol:", error);
		}
	};

	const handleOpenModalUser = (field: "secretary" | "supervisor") => {
		setIsSelectingFor(field);
		setIsModalOpenUser(true);
	};

	const handleCloseModalUser = () => {
		setIsModalOpenUser(false);
		setIsSelectingFor(null);
	};

	const handleCloseTextModal = () => {
		setIsModalOpenText(false);
		setShouldFetchProtocol(true);
	};

	if (isLoading) return <SkeletonProtocol />;
	if (error)
		return (
			<div className="mt-5 text-mainPurple font-bold mx-auto">
				Ошибка загрузки данных
			</div>
		);
	if (!protocol)
		return (
			<div className="mt-5 text-gardenGreen font-bold mx-auto">
				Нет данных протокола
			</div>
		);

	return (
		<div className="flex flex-col items-center mt-8 mr-5 w-full">
			<div className="min-w-full flex items-center justify-between py-2 px-7 font-bold text-mainPurple rounded-xl bg-gray-100">
				<Backward
					className="w-9 h-9 cursor-pointer fill-current text-mainPurple hover:text-mainPurpleHover active:text-mainPurpleActive"
					onClick={() => navigate(-1)}
				/>
				<h1 className="lg:text-2xl text-xl">
					Протокол {protocol.data.protocol_number}
				</h1>
				<div className="flex gap-8 justify-center items-center">
					<div className="flex gap-4">
						{protocol?.data.stage === ProtocolStage.Final && (
							<div className="flex gap-4">
								<button
									className="text-base bg-mainPurple text-white px-4 py-1 rounded-lg hover:bg-mainPurpleHover active:bg-mainPurpleActive"
									onClick={() => handleGeneratePDF(generatePDF, Number(id))}
								>
									PDF
								</button>
								<button
									className="text-base bg-mainPurple text-white px-4 py-2 rounded-lg hover:bg-mainPurpleHover active:bg-mainPurpleActive"
									onClick={() => handleGenerateDOCX(generateDOCX, Number(id))}
								>
									DOCX
								</button>
							</div>
						)}
					</div>

					<Delete
						className="w-7 h-7 fill-current text-gray-500 hover:text-crimsonRed cursor-pointer"
						onClick={() => setIsDeleteModalOpen(true)}
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 grid-rows-1 mt-6 gap-4 w-full">
				<div className="bg-gray-100 py-5 px-3 rounded-xl">
					<ProtocolParticipantList />
					<h2 className="font-bold text-xl text-mainPurple text-center mt-8">
						Видеозапись
					</h2>
					<div className="bg-black w-full mt-5">
						<div className="relative pt-[56.25%]">
							{" "}
							<ReactPlayer
								url={protocol.data.video_path}
								playing={false}
								loop={true}
								controls
								width="100%"
								height="100%"
								className="absolute top-0 left-0"
							/>
						</div>
					</div>
				</div>
				<div className="flex justify-center w-full bg-gray-100 py-5 xl:px-10 px-5 lg:px-7 rounded-xl">
					<form
						className="w-full flex flex-col items-center xl:text-xl lg:text-lg font-bold text-mainPurple gap-8"
						onSubmit={formik.handleSubmit}
					>
						<div className="flex flex-col items-center w-full">
							<label className="mb-2" htmlFor="theme">
								Тема
							</label>
							<input
								className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent"
								id="theme"
								name="theme"
								type="text"
								value={formik.values.theme}
								onChange={formik.handleChange}
								onBlur={handleBlur}
							/>
							{formik.touched.theme && formik.errors.theme ? (
								<div className="text-red-500 text-sm">
									{formik.errors.theme}
								</div>
							) : null}
						</div>
						<div className="flex flex-col items-center w-full">
							<label className="mb-2" htmlFor="agenda">
								Повестка
							</label>
							<input
								className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent  "
								id="agenda"
								name="agenda"
								type="text"
								value={formik.values.agenda}
								onChange={formik.handleChange}
								onBlur={handleBlur}
							/>
							{formik.touched.agenda && formik.errors.agenda ? (
								<div className="text-red-500 text-sm">
									{formik.errors.agenda}
								</div>
							) : null}
						</div>
						<div className="flex flex-col items-center w-full">
							<label className="mb-2" htmlFor="secretary">
								Секретарь
							</label>
							<input
								className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent cursor-pointer  hover:bg-lightPurpleHover transition-colors duration-200 ease-in-out"
								id="secretary"
								name="secretaryName"
								type="text"
								value={formik.values.secretaryName}
								onClick={() => handleOpenModalUser("secretary")}
								readOnly
							/>
						</div>
						<div className="flex flex-col items-center w-full">
							<label className="mb-2" htmlFor="director">
								Председатель
							</label>
							<input
								className="w-full px-3 py-4 bg-lightPurple rounded-lg focus:outline-none focus:ring-2 focus:ring-mainPurple focus:border-transparent cursor-pointer  hover:bg-lightPurpleHover transition-colors duration-200 ease-in-out"
								id="director"
								name="directorName"
								type="text"
								value={formik.values.directorName}
								onClick={() => handleOpenModalUser("supervisor")}
								readOnly
							/>
						</div>
						<button
							type="button"
							className="block p-2 rounded-lg bg-mainPurple text-white font-bold hover:bg-mainPurpleHover active:bg-mainPurpleActive"
							onClick={() => setIsModalOpenTask(true)}
						>
							Задачи протокола
						</button>
					</form>
				</div>
				<div className="min-w-full xl:text-lg text-base col-span-2 bg-gray-100 rounded-xl py-5 px-3">
					<h2 className="xl:text-xl lg:text-lg text-center font-bold text-mainPurple mb-5">
						Стенограмма С временем
					</h2>
					<p>{protocol.data.transcript}</p>
				</div>
			</div>
			<div className="flex gap-4">
				<button
					className={`my-6 text-white font-bold text-xl px-3 py-2 rounded-lg ${
						isUpdatingStatus
							? "bg-gray-500 cursor-not-allowed"
							: initialValues.status === "success"
							? "bg-gardenGreen hover:bg-gardenGreenHover"
							: "bg-mainPurple hover:bg-mainPurpleHover active:bg-mainPurpleActive"
					}`}
					onClick={handleStatusToggle}
					disabled={isUpdatingStatus}
				>
					{initialValues.status === "success"
						? "Исполнено"
						: "Исполнить протокол"}
				</button>
				<button
					className="my-6 text-white font-bold text-xl bg-mainPurple py-3 px-2 rounded-lg hover:bg-mainPurpleHover active:bg-mainPurpleActive"
					onClick={() => setIsModalOpenText(true)}
				>
					Текст протокола
				</button>
			</div>

			{isModalOpenUser && (
				<ExternalUserAddModal
					onClose={handleCloseModalUser}
					onUserSelect={handleUserSelect}
				/>
			)}
			{isModalOpenTask && (
				<ProtocolTaskAddModal
					protocolId={protocol.data.id}
					protocolData={protocol.data}
					onClose={() => setIsModalOpenTask(false)}
				/>
			)}

			{isModalOpenText && (
				<ProtocolTextModal
					protocolId={protocol.data.id}
					location={protocol.data.location}
					city={protocol.data.city}
					event_start_time={protocol.data.event_start_time}
					final_transcript={protocol.data.final_transcript}
					onClose={() => setIsModalOpenText(false)}
				/>
			)}

			{isDeleteModalOpen && (
				<DeleteElementModal
					title="Удаление протокола"
					description={`Протокол №${protocol.data.protocol_number}`}
					onClose={handleCloseTextModal}
					onDelete={handleDelete}
				/>
			)}
		</div>
	);
};

export default Protocol;

const SkeletonProtocol = () => {
	return (
		<div className="grid grid-cols-2 w-full my-10 gap-5 mx-5">
			<div className="flex flex-col justify-center items-center bg-gray-100 rounded-2xl p-5 w-full gap-3">
				<Skeleton width="full" height="full" className="rounded-lg mx-auto" />
			</div>
			<div className="flex flex-col justify-center items-center bg-gray-100 rounded-2xl p-5 w-full gap-3">
				<Skeleton width="full" height="full" className="rounded-lg mx-auto" />
			</div>
		</div>
	);
};
