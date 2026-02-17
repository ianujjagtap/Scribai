export interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: number;
}

export interface GrammarSuggestion {
	original: string;
	correction: string;
	explanation: string;
	type: "grammar" | "spelling" | "style" | "rewrite";
}

export interface AIState {
	isAnalyzing: boolean;
	suggestions: GrammarSuggestion[];
	error: string | null;
}

export enum Tone {
	PROFESSIONAL = "Professional",
	CASUAL = "Casual",
	CONCISE = "Concise",
	EXPANDED = "Expanded",
}
