import { GoogleGenAI, Type } from "@google/genai";
import type { GrammarSuggestion, Tone } from "../types";

const getAIClient = () => {
	const apiKey = process.env.API_KEY;
	if (!apiKey) {
		throw new Error("API Key not found in environment variables");
	}
	return new GoogleGenAI({ apiKey });
};

export const checkGrammarAndStyle = async (
	text: string,
): Promise<GrammarSuggestion[]> => {
	if (!text || text.trim().length < 5) return [];

	const ai = getAIClient();

	try {
		const response = await ai.models.generateContent({
			model: "gemini-3-flash-preview",
			contents: `Analyze the following text for grammar, spelling, and clarity issues. 
      Return a list of specific improvements. 
      Text to analyze: "${text}"`,
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.ARRAY,
					items: {
						type: Type.OBJECT,
						properties: {
							original: {
								type: Type.STRING,
								description:
									"The specific substring in the text that needs changing.",
							},
							correction: {
								type: Type.STRING,
								description: "The suggested replacement text.",
							},
							explanation: {
								type: Type.STRING,
								description: "A brief reason for the change.",
							},
							type: {
								type: Type.STRING,
								enum: ["grammar", "spelling", "style"],
							},
						},
						required: ["original", "correction", "explanation", "type"],
					},
				},
			},
		});

		if (response.text) {
			return JSON.parse(response.text) as GrammarSuggestion[];
		}
		return [];
	} catch (error) {
		console.error("Error checking grammar:", error);
		throw error;
	}
};

export const rewriteText = async (
	text: string,
	tone: Tone,
): Promise<GrammarSuggestion> => {
	if (!text) throw new Error("No text provided");

	const ai = getAIClient();

	try {
		const response = await ai.models.generateContent({
			model: "gemini-3-flash-preview",
			contents: `Rewrite the following text to have a ${tone} tone. Keep the core meaning but improve the flow and vocabulary.
      
      Original Text:
      "${text}"`,
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						rewrittenText: {
							type: Type.STRING,
							description:
								"The completely rewritten version of the provided text.",
						},
					},
					required: ["rewrittenText"],
				},
			},
		});

		let correction = text;
		if (response.text) {
			try {
				const json = JSON.parse(response.text);
				if (json.rewrittenText) {
					correction = json.rewrittenText;
				}
			} catch (e) {
				console.error("Failed to parse rewrite response", e);
			}
		}

		return {
			original: text,
			correction: correction,
			explanation: `Rewritten to be more ${tone.toLowerCase()}.`,
			type: "rewrite",
		};
	} catch (error) {
		console.error("Error rewriting text:", error);
		throw error;
	}
};

export const generateTitle = async (text: string): Promise<string> => {
	if (!text || text.length < 10) return "New Note";

	const ai = getAIClient();
	try {
		const response = await ai.models.generateContent({
			model: "gemini-3-flash-preview",
			contents: `Generate a very short, concise title (max 5 words) for this note: "${text.substring(0, 500)}..."`,
		});
		return response.text?.replace(/['"]/g, "").trim() || "New Note";
	} catch (_e) {
		return "New Note";
	}
};
