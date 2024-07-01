export interface Member {
	id?: number;
	full_name: string;
	email: string;
}

export interface Members {
	id?: number;
	member: Member;
	email_sent?: boolean;
	should_notify: boolean;
}

export interface Meeting {
	id?: number;
	theme: string;
	link: string;
	event_date: string;
	event_start_time: string;
	event_end_time: string;
	members?: Members[];
	document?: string | undefined;
	document_url?: string | undefined;
}

export interface UpdateMeetingMember {
	member_id: number;
	should_notify: boolean;
}

export type CreateMeeting = Omit<Meeting, "document_path"> & {
	members?: Members[];
};
export type CreateMeetingForm = Omit<
	Meeting,
	"id" | "members" | "document_url"
> & {
	members: {
		member_id: number;
		should_notify: boolean;
	}[];
	document?: string;
};
export type UpdateMeeting = Partial<Omit<Meeting, "id">> & {
	members?: UpdateMeetingMember[];
};

export interface MeetingResponse {
	data: Meeting[];

	errors?: any[];
}
