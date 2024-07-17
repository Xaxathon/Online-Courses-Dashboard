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
		onUpdate: (protocol: any) => void
	) {
		if (!this.echo) {
			this.initialize();
		}

		const channelName = `secretary_protocol.${protocolId}`;
		this.echo
			?.private(channelName)
			.listen(".VideoProcessed", (e: { protocol: any }) => {
				onUpdate(e.protocol);
			});

		return () => {
			this.echo?.leave(channelName);
		};
	}
}

export const echoService = new EchoService();

export const listenToProtocolUpdates = (
	protocolId: number,
	onUpdate: (protocol: Protocol) => void
) => {
	return echoService.listenToProtocolUpdates(protocolId, onUpdate);
};
