// src/echo.ts

import Echo from "laravel-echo";
import { io } from "socket.io-client";

declare global {
	interface Window {
		Echo: Echo;
		io: typeof io;
	}
}

const token = localStorage.getItem("token");

// Настройка Echo
window.io = io;

const echo = new Echo({
	broadcaster: "socket.io",
	host: `${window.location.hostname}:5176`,
	auth: {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	},
});

window.Echo = echo;

export default echo;
