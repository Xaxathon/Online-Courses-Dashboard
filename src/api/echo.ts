import { Protocol } from "@/shared/interfaces/protocol";
import Echo from "laravel-echo";
import io from "socket.io-client";

declare global {
	interface Window {
		io: typeof io;
	}
}

window.io = io;

class EchoService {
	private echo: Echo | null = null;
	private listeners: Map<
		number,
		{ unsubscribe: () => void; listener: (e: { protocol: Protocol }) => void }
	> = new Map();

	initialize() {
		const token = localStorage.getItem("token");
		this.echo = new Echo({
			broadcaster: "socket.io",
			host: `${import.meta.env.VITE_API_BASE_URL}:${
				import.meta.env.VITE_API_BASE_PORT
			}`,
			auth: {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		});
	}

	listenToProtocolUpdates(
		protocolId: number,
		onUpdate: (protocol: Protocol) => void
	) {
		this.initialize();

		const channel = this.echo?.private(`secretary_protocol.${protocolId}`);
		const listener = (e: { protocol: Protocol }) => {
			onUpdate(e.protocol);
		};

		channel?.listen(".VideoProcessed", listener);

		const unsubscribe = () => {
			channel?.stopListening(".VideoProcessed", listener);
			this.listeners.delete(protocolId);
		};

		this.listeners.set(protocolId, { unsubscribe, listener });

		return unsubscribe;
	}

	stopListeningToProtocol(protocolId: number) {
		const listenerInfo = this.listeners.get(protocolId);
		if (listenerInfo) {
			listenerInfo.unsubscribe();
			this.listeners.delete(protocolId);
		}
	}

	stopListeningToAllProtocols() {
		this.listeners.forEach(({ unsubscribe }) => {
			unsubscribe();
		});
		this.listeners.clear();
	}
}

export const echoService = new EchoService();

export const listenToProtocolUpdates = (
	protocolId: number,
	onUpdate: (protocol: Protocol) => void
) => {
	return echoService.listenToProtocolUpdates(protocolId, onUpdate);
};
