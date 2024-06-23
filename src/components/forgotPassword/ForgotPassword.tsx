import React from "react";

const ForgotPassword = () => {
	return (
		<div className="flex items-center justify-center min-h-screen top-0 left-0 w-full text-mainPurple">
			<form className=" border-effect border bg-white shadow-effect px-5 py-5 rounded-2xl w-[30rem] min-h-[15rem]">
				<span>Назад</span>
				<h2 className="text-xl text-center font-bold mb-5">Сброс пароля</h2>
				<div className="flex flex-col gap-1">
					<label className=" text-lg" htmlFor="email">
						E-mail
					</label>
					<input
						className="text-black text-base bg-white p-3 rounded-lg ring-2 ring-mainPurple focus:outline-none focus:ring-statusSalate border-transparent"
						id="email"
						type="text"
					/>
				</div>

				<div className="w-full flex justify-center mt-10">
					<button className=" rounded-md px-10 py-2 bg-mainPurple text-white text-base font-bold">
						Отправить ссылку для сброса пароля
					</button>
				</div>
			</form>
		</div>
	);
};

export default ForgotPassword;
