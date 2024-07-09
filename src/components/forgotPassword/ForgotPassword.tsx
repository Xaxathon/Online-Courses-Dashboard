import { useState } from "react";

import { ReactComponent as Backward } from "@assets/icons/backward.svg";

import { useNavigate } from "react-router-dom";

import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { useForgotPasswordMutation } from "@/api/authApi";

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Неверный формат e-mail")
				.required("Обязательное поле"),
		}),
		onSubmit: async (
			values,
			{ setSubmitting, setErrors }: FormikHelpers<{ email: string }>
		) => {
			try {
				await forgotPassword(values).unwrap();
				setSuccessMessage(
					"Инструкции по сбросу пароля отправлены на ваш e-mail."
				);
			} catch (err: any) {
				setErrors({
					email: err.data?.message || "Не удалось отправить инструкции",
				});
			}
			setSubmitting(false);
		},
	});

	return (
		<div className="flex items-center justify-center min-h-screen top-0 left-0 w-full text-mainPurple">
			<form
				onSubmit={formik.handleSubmit}
				className="border-effect border bg-white shadow-effect px-5 py-5 rounded-2xl w-[30rem] min-h-[15rem]"
			>
				<div
					className="flex items-center gap-1 text-mainPurple hover:text-gardenGreen active:text-mainPurpleActive cursor-pointer"
					onClick={() => navigate(-1)}
				>
					<Backward className="w-6 h-6 fill-current" />
					<span>Назад</span>
				</div>

				<h2 className="text-xl text-center font-bold mb-5">Сброс пароля</h2>
				{successMessage && (
					<div className="text-gardenGreen font-bold mb-5">
						{successMessage}
					</div>
				)}
				<div className="flex flex-col gap-1">
					<label className="text-lg" htmlFor="email">
						E-mail
					</label>
					<input
						className={`text-black text-base bg-white p-3 rounded-lg ring-2 focus:outline-none border-transparent  ${
							formik.touched.email && formik.errors.email
								? "ring-crimsonRed"
								: "ring-mainPurple focus:ring-gardenGreen"
						} border-transparent`}
						id="email"
						type="text"
						{...formik.getFieldProps("email")}
					/>
					{formik.touched.email && formik.errors.email ? (
						<span className="text-crimsonRed font-bold">
							{formik.errors.email}
						</span>
					) : null}
				</div>

				<div className="w-full flex justify-center mt-10">
					<button
						type="submit"
						className="rounded-md px-10 py-2 bg-mainPurple text-white text-base font-bold"
						disabled={isLoading}
					>
						{isLoading ? "Отправка..." : "Отправить ссылку для сброса пароля"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ForgotPassword;
