export interface ManagerStatsData {
	meetings: {
		in_process: number;
		success: number;
	};
	tasks: {
		process: number;
		expired: number;
		success: number;
	};
	protocols: {
		in_process: number;
		success: number;
	};
}

export interface MeetingStatsData {
	id: number;
	event_date: string;
}

export interface MeetingStatsResponse {
	data: MeetingStatsData[];
}

export interface KpiTasksStatsData {
	week: number;
	in_process: number;
	success: number;
	expired: number;
}

export interface KpiTasksStatsResponse {
	data: KpiTasksStatsData[];
}

export interface EntityStatsData {
	meetings: { in_process: number; success: number };
	protocols: { in_process: number; success: number };
}

export interface EntityStatsResponse {
	data: EntityStatsData;
}
