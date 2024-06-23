// Login.js
import React, { useState } from "react";
import { useFormik, FormikHelpers, FormikErrors } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, useLazyFetchUserQuery } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setToken, setRole, setUserId } from "../../features/authSlice";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;

interface LoginFormValues {
	email: string;
	password: string;
}

interface LoginFormErrors extends FormikErrors<LoginFormValues> {
	submit?: string;
}

const Login = () => {
	const [login, { isLoading }] = useLoginMutation();
	const [fetchUser] = useLazyFetchUserQuery();
	const dispatch = useDispatch<AppDispatch>();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const navigate = useNavigate();

	const formik = useFormik<LoginFormValues>({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.matches(emailRegex, "Неверный формат e-mail")
				.required("Обязательное поле"),
			password: Yup.string().required("Обязательное поле"),
		}),
		onSubmit: async (
			values,
			{ setSubmitting, setErrors }: FormikHelpers<LoginFormValues>
		) => {
			try {
				console.log("Logging in with values:", values); // Отладочное сообщение
				const response = await login(values).unwrap();
				console.log("Login successful, response:", response); // Отладочное сообщение

				// Проверяем, что токен получен
				const token = response.data?.token;
				if (token) {
					dispatch(setToken(token));
					console.log("Token set in store:", token); // Отладочное сообщение

					// Получаем информацию о пользователе
					const userResponse = await fetchUser().unwrap();
					const role = userResponse.data.role;
					const userId = userResponse.data.id;

					if (role) {
						dispatch(setRole(role));
						console.log("Role set in store:", role); // Отладочное сообщение
					}

					if (userId) {
						dispatch(setUserId(userId));
						console.log("UserId set in store:", userId); // Отладочное сообщение
					}

					navigate("/main");
				} else {
					throw new Error("Token not found in response");
				}
			} catch (err: any) {
				console.error("Login failed, error:", err); // Отладочное сообщение
				setErrors({
					submit: err.data?.message || "Не удалось авторизоваться",
				} as LoginFormErrors);
			}
			setSubmitting(false);
		},
	});
	console.log(formik.values);
	return (
		<div className="flex items-center justify-center min-h-screen top-0 left-0 w-full text-mainPurple">
			<form
				onSubmit={formik.handleSubmit}
				className="border-effect border bg-white shadow-effect px-5 py-10 rounded-2xl w-[30rem] min-h-[20rem]"
			>
				<h2 className="text-xl text-center font-bold mb-5">Вход</h2>
				<div className="flex flex-col gap-1">
					<label className="text-lg font-bold" htmlFor="email">
						E-mail
					</label>
					<input
						className={`text-black text-base bg-white p-3 rounded-lg ring-2 focus:outline-none border-transparent ${
							formik.touched.email && formik.errors.email
								? "ring-statusRed"
								: "ring-mainPurple focus:ring-statusSalate"
						}`}
						id="email"
						type="text"
						{...formik.getFieldProps("email")}
					/>
					{formik.touched.email && formik.errors.email ? (
						<span className="text-statusRed font-bold">
							{formik.errors.email}
						</span>
					) : null}
				</div>

				<div className="flex flex-col gap-1 mt-5">
					<label className="text-lg font-bold" htmlFor="password">
						Пароль
					</label>
					<div className="relative">
						<input
							className={`text-black text-base bg-white p-3 rounded-lg ring-2 focus:outline-none border-transparent w-full ${
								formik.touched.password && formik.errors.password
									? "ring-statusRed"
									: "ring-mainPurple focus:ring-statusSalate"
							}`}
							id="password"
							type={showPassword ? "text" : "password"}
							{...formik.getFieldProps("password")}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? "Скрыть" : "Показать"}
						</button>
					</div>
					{formik.touched.password && formik.errors.password ? (
						<span className="text-statusRed font-bold">
							{formik.errors.password}
						</span>
					) : null}
					<Link
						to="/reset-password"
						className="flex justify-end mt-1 hover:text-statusSalate"
					>
						Забыли пароль?
					</Link>
				</div>
				<div className="w-full flex justify-center mt-4">
					<button
						type="submit"
						className={`mt-2 rounded-xl px-14 py-2 text-xl font-bold ${
							isLoading
								? "bg-gray-500 text-gray-300 cursor-not-allowed"
								: "bg-mainPurple text-white"
						}`}
						disabled={isLoading}
					>
						{isLoading ? "Загрузка..." : "Войти"}
					</button>
					{formik.errors.submit && (
						<div className="text-statusRed mt-4">{formik.errors.submit}</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default Login;
