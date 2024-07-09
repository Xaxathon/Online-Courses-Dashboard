import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="flex items-center justify-center h-screen w-screen bg-white">
			<div className="text-center">
				<h1 className="text-mainPurple font-baloo font-extrabold text-9xl mb-4">
					404
				</h1>
				<p className="text-mainPurple text-xl font-bold mb-8">
					Упс ... Такой страницы нет
				</p>
				<div className="space-x-4">
					<button
						onClick={handleGoBack}
						className="inline-block px-10 py-2 rounded-lg text-white bg-mainPurple text-xl hover:bg-opacity-90 transition-colors"
					>
						Назад
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
