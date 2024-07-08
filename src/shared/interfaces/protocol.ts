export enum ProtocolStage {
	VideoProcess = "video_process",
	SuccessVideoProcess = "success_video_process",
	ErrorVideoProcess = "error_video_process",
	Finish = "finish",
}

export interface Protocol {
	id: number;
	theme: string;
	agenda: string;
	secretary: { id: number; full_name: string };
	director: { id: number; full_name: string };
	event_date: string;
	final_transcript: string;
	stage: ProtocolStage;
	status: string;
	transcript: string;
	video_path: string;
	execute: boolean;
	secretary_id: number;
	director_id: number;
}

export interface CreateProtocol {
	theme: string;
	agenda: string;
	secretary_id: number;
	director_id: number;
	event_date: string;
	video: string;
}

export interface ProtocolTaskData {
	responsible_id: number;
	essence: string;
	deadline: string;
	status: string;
}

export interface ProtocolTask {
	deadline: string;
	essence: string;
	status: string;
	id: number;
	protocol: {
		id: number;
		director: {
			full_name: string;
		};
	};
	responsible: {
		full_name: string;
	};
}

export interface ProtocolTasksData {
	data: ProtocolTask[];
}

export interface AddProtocolMemberData {
	member_id: number;
}

export interface ProtocolMember {
	id: number;
	member: {
		id: number;
		full_name: string;
	};
}

export type ProtocolMembersResponse = ProtocolMember[];

export interface ProtocolTasksResponse {
	data: ProtocolTasksData;
	meta: { to: number; total: number };
}

export interface ProtocolResponse {
	data: Protocol;
}

export interface ProtocolsListResponse {
	data: Protocol[];
	links: { next: string | null };
}
