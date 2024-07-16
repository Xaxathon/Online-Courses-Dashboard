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
			host: "http://77.232.129.223:6001",
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
				console.log("Received VideoProcessed event:", e);
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
