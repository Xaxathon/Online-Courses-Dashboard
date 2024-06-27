export interface Keyword {
	id: number;
	title: string;
	phrase: string;
}

export interface KeywordAdd extends Partial<Omit<Keyword, "id">> {
	title: string;
	phrase: string;
	id?: number;
}

export interface CreateUpdateKeywordRequest {
	keywords: KeywordAdd[];
}

export interface KeywordResponse {
	errors?: string;
	data: Keyword[];
}
