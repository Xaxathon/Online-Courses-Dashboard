import { useNavigate, useLocation, Link } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import classNames from "classnames";

import { useResetPasswordMutation } from "@/api/authApi";

const ResetPassword = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

	const searchParams = new URLSearchParams(location.search);

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	const formik = useFormik({
		initialValues: {
			token: token || "",
			email: email || "",
			password: "",
			password_confirmation: "",
		},
		validationSchema: Yup.object({
			password: Yup.string()
				.min(6, "Пароль должен содержать минимум 6 символов")
				.required("Поле обязательно для заполнения"),
			password_confirmation: Yup.string()
				.oneOf([Yup.ref("password")], "Пароли должны совпадать")
				.required("Поле обязательно для заполнения"),
		}),
		onSubmit: async (values, { setSubmitting }) => {
			try {
				await resetPassword(values).unwrap();
				navigate("/login");
			} catch (error) {
				console.error("Ошибка при сбросе пароля:", error);
			}
			setSubmitting(false);
		},
	});

	const errorMessage = error
		? "data" in error && (error.data as any)?.message
			? (error.data as any).message
			: "Эта ссылка не действительна"
		: "";

	return (
		<div className="flex items-center justify-center min-h-screen top-0 left-0 w-full text-mainPurple">
			<form
				onSubmit={formik.handleSubmit}
				className="border-effect border bg-white shadow-effect px-5 py-5 rounded-2xl w-[30rem] min-h-[15rem]"
			>
				<h2 className="text-xl text-center font-bold mb-5">Сброс пароля</h2>

				{!error && (
					<>
						<input
							type="text"
							name="email"
							autoComplete="email"
							value={email || ""}
							style={{ display: "none" }}
							readOnly
						/>
						<div className="mb-4">
							<label htmlFor="password" className="block mb-2 font-bold">
								Новый пароль
							</label>
							<input
								id="password"
								type="password"
								{...formik.getFieldProps("password")}
								autoComplete="new-password"
								className="w-full px-3 py-2 border-2 ring-mainPurple rounded-md ring-2 focus:outline-none border-transparent focus:ring-gardenGreen"
							/>
							{formik.touched.password && formik.errors.password ? (
								<div className="text-crimsonRed mt-1">
									{formik.errors.password}
								</div>
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
								autoComplete="confirm-password"
								className="w-full px-3 py-2 border-2 ring-mainPurple rounded-md ring-2 focus:outline-none border-transparent focus:ring-gardenGreen"
							/>
							{formik.touched.password_confirmation &&
							formik.errors.password_confirmation ? (
								<div className="text-crimsonRed mt-1">
									{formik.errors.password_confirmation}
								</div>
							) : null}
						</div>

						<div className="w-full flex justify-center mt-6">
							<button
								type="submit"
								className={classNames(
									"rounded-md px-10 py-2 text-white text-base font-bold",
									{
										"bg-gray-500 cursor-not-allowed": isLoading,
										"bg-mainPurple": !isLoading,
									}
								)}
								disabled={isLoading}
							>
								{isLoading ? "Загрузка..." : "Сбросить пароль"}
							</button>
						</div>
					</>
				)}

				{error && (
					<div className="flex flex-col items-center justify-center mt-4">
						<span className=" text-center text-crimsonRed font-bold mb-10">
							{errorMessage}
						</span>

						<Link
							className="text-white bg-mainPurple p-2 rounded-lg hover:bg-mainPurpleHover active:bg-mainPurpleActive "
							to="/login"
						>
							Вернуться на главную страницу
						</Link>
					</div>
				)}
			</form>
		</div>
	);
};

export default ResetPassword;
