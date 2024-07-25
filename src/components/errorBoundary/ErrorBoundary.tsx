import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	handleRefresh = () => {
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex items-center justify-center h-screen w-screen bg-white">
					<div className="text-center">
						<h1 className="text-mainPurple font-baloo font-extrabold text-9xl mb-4">
							404
						</h1>
						<p className="text-mainPurple text-xl font-bold mb-8">
							Нет подключения к интернету
						</p>
						<button
							onClick={this.handleRefresh}
							className="bg-mainPurple text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
						>
							Обновить страницу
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
