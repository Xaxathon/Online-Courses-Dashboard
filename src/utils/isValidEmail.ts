import * as Yup from "yup";

export const userValidationSchema = Yup.object().shape({
	full_name: Yup.string().required("Полное имя обязательно."),
	department: Yup.string().required("Отдел обязателен."),
	login: Yup.string().required("Логин обязателен."),
	email: Yup.string()
		.email("Неверный формат email.")
		.required("Email обязателен."),
	password: Yup.string().min(6, "Пароль должен быть не менее 6 символов."),
});
