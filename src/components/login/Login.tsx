import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import classNames from "classnames";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setToken, setRole, setUserId } from "@/store/slices/authSlice";
import { useLoginMutation, useLazyFetchPersonalUserQuery } from "@/api/authApi";

import { LoginFormValues } from "@/shared/interfaces/auth";

import { UserResponse } from "@/shared/interfaces/user";

const Login = () => {
	const [login, { isLoading }] = useLoginMutation();
	const [fetchUser] = useLazyFetchPersonalUserQuery();
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
				.email("Неверный формат e-mail")
				.required("Обязательное поле"),
			password: Yup.string().required("Обязательное поле"),
		}),
		onSubmit: async (
			values,
			{ setSubmitting, setErrors }: FormikHelpers<LoginFormValues>
		) => {
			try {
				const response = await login(values).unwrap();

				const token = response.data?.token;
				if (token) {
					dispatch(setToken(token));

					const userResponse: UserResponse = await fetchUser().unwrap();
					const role = userResponse.data.role;
					const userId = userResponse.data.id;

					if (role) {
						dispatch(setRole(role));
					}

					if (userId) {
						dispatch(setUserId(userId));
					}

					navigate("/main");
				} else {
					throw new Error("Token not found in response");
				}
			} catch (error) {
				if (error && typeof error === "object" && "data" in error) {
					const errorData = error as { data?: { message?: string } };
					setErrors({
						submit: errorData.data?.message,
					});
				}
			}
			setSubmitting(false);
		},
	});

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
						className={classNames(
							"text-black text-base bg-white p-3 rounded-lg ring-2 focus:outline-none border-transparent",
							{
								"ring-crimsonRed": formik.touched.email && formik.errors.email,
								"ring-mainPurple focus:ring-gardenGreen": !(
									formik.touched.email && formik.errors.email
								),
							}
						)}
						id="email"
						type="text"
						{...formik.getFieldProps("email")}
						autoComplete="email"
					/>
					{formik.touched.email && formik.errors.email ? (
						<span className="text-crimsonRed font-bold">
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
							className={classNames(
								"text-black text-base bg-white p-3 rounded-lg ring-2 focus:outline-none border-transparent w-full",
								{
									"ring-crimsonRed":
										formik.touched.password && formik.errors.password,
									"ring-mainPurple focus:ring-gardenGreen": !(
										formik.touched.password && formik.errors.password
									),
								}
							)}
							id="password"
							type={showPassword ? "text" : "password"}
							{...formik.getFieldProps("password")}
							autoComplete="current-password"
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
						<span className="text-crimsonRed font-bold">
							{formik.errors.password}
						</span>
					) : null}
					<Link
						to="/reset-password"
						className="flex justify-end mt-1 hover:text-gardenGreen"
					>
						Забыли пароль?
					</Link>
				</div>
				<div className="w-full flex justify-center mt-4">
					<button
						type="submit"
						className={classNames(
							"mt-2 rounded-xl px-14 py-2 text-xl font-bold",
							{
								"bg-gray-500 text-gray-300 cursor-not-allowed": isLoading,
								"bg-mainPurple text-white hover:bg-mainPurpleHover active:bg-mainPurpleActive":
									!isLoading,
							}
						)}
						disabled={isLoading}
					>
						{isLoading ? "Загрузка..." : "Войти"}
					</button>
				</div>
				{formik.errors.submit && (
					<div className="text-crimsonRed mt-4 font-bold text-start">
						{formik.errors.submit}
					</div>
				)}
			</form>
		</div>
	);
};

export default Login;
