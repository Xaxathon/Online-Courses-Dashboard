declare module "socket.io-client" {
	const io: {
		(uri: string, opts?: any): any;
		(opts?: any): any;
		(host: string, opts?: any): any;
		Manager: any;
		Socket: any;
	};

	export = io;
}
