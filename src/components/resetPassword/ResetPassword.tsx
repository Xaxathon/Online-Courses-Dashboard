import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import { ReactComponent as Backward } from "@assets/icons/backward.svg";

import { useResetPasswordMutation } from "@/api/authApi";

interface ApiError {
	data?: {
		message?: string;
	};
}

const ResetPassword = () => {
	const navigate = useNavigate();
	const [resetPassword, { isLoading }] = useResetPasswordMutation();
	const [formError, setFormError] = useState("");

	const formik = useFormik({
		initialValues: {
			password: "",
			password_confirmation: "",
		},
		validationSchema: Yup.object({
			password: Yup.string()
				.min(6, "Пароль должен содержать минимум 6 символов")
				.required("Обязательное поле"),
			password_confirmation: Yup.string()
				.oneOf([Yup.ref("password")], "Пароли должны совпадать")
				.required("Обязательное поле"),
		}),
		onSubmit: async (values, { setSubmitting }) => {
			try {
				await resetPassword(values).unwrap();
				navigate("/login", {
					state: {
						message: "Пароль успешно сброшен. Пожалуйста, войдите в систему.",
					},
				});
			} catch (err) {
				if (typeof err === "object" && err !== null && "data" in err) {
					const apiError = err as ApiError;
					setFormError(apiError.data?.message || "Ошибка при сбросе пароля");
				} else {
					setFormError("Эта ссылка не действительна");
				}
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

				<div className="mb-4">
					<label htmlFor="password" className="block mb-2 font-bold">
						Новый пароль
					</label>
					<input
						id="password"
						type="password"
						{...formik.getFieldProps("password")}
						className="w-full px-3 py-2 border-2 ring-mainPurple  rounded-md ring-2 focus:outline-none border-transparent focus:ring-gardenGreen"
					/>
					{formik.touched.password && formik.errors.password ? (
						<div className="text-crimsonRed mt-1">{formik.errors.password}</div>
					) : null}
				</div>

				<div className="mb-4">
					<label
						htmlFor="password_confirmation"
						className="block mb-2 font-bold"
					>
						Подтвердите новый пароль
					</label>
					<input
						id="password_confirmation"
						type="password"
						{...formik.getFieldProps("password_confirmation")}
						className="w-full px-3 py-2 border-2 ring-mainPurple rounded-md ring-2 focus:outline-none border-transparent focus:ring-gardenGreen"
					/>
					{formik.touched.password_confirmation &&
					formik.errors.password_confirmation ? (
						<div className="text-crimsonRed mt-1">
							{formik.errors.password_confirmation}
						</div>
					) : null}
				</div>

				{formError && (
					<div className="text-crimsonRed font-bold mb-4">{formError}</div>
				)}

				<div className="w-full flex justify-center mt-6">
					<button
						type="submit"
						className="rounded-md px-10 py-2 bg-mainPurple text-white text-base font-bold"
						disabled={isLoading}
					>
						Сбросить пароль
					</button>
				</div>
			</form>
		</div>
	);
};

export default ResetPassword;
