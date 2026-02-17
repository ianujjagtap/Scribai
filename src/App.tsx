import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AIPanel } from "./components/ai-panel";
import { Editor } from "./components/editor";
import { FloatingToolbar } from "./components/floating-toolbar";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import {
	checkGrammarAndStyle,
	generateTitle,
	rewriteText,
} from "./services/geminiService";
import type { GrammarSuggestion, Note, Tone } from "./types";

declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: SpeechRecognition is not standard
		SpeechRecognition: any;
		// biome-ignore lint/suspicious/noExplicitAny: webkitSpeechRecognition is not standard
		webkitSpeechRecognition: any;
	}
}

const STORAGE_KEY = "scribe_ai_notes";

function App() {
	const [currentText, setCurrentText] = useState("");
	const [isRecording, setIsRecording] = useState(false);
	const [notes, setNotes] = useState<Note[]>([]);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [suggestions, setSuggestions] = useState<GrammarSuggestion[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isRewriting, setIsRewriting] = useState(false);
	const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
	const [notification, setNotification] = useState<string | null>(null);

	const showNotification = useCallback((msg: string) => {
		setNotification(msg);
		setTimeout(() => setNotification(null), 3000);
	}, []);

	// biome-ignore lint/suspicious/noExplicitAny: ref is used for speech recognition
	const recognitionRef = useRef<any>(null);

	useEffect(() => {
		if (
			!("webkitSpeechRecognition" in window) &&
			!("SpeechRecognition" in window)
		) {
			setNotification("Speech recognition is not supported in this browser.");
			return;
		}

		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		recognitionRef.current = new SpeechRecognition();
		recognitionRef.current.continuous = true;
		recognitionRef.current.interimResults = true;
		recognitionRef.current.lang = "en-US";

		// biome-ignore lint/suspicious/noExplicitAny: event is not typed
		recognitionRef.current.onresult = (event: any) => {
			let finalTranscript = "";

			for (let i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					finalTranscript += event.results[i][0].transcript;
				}
			}

			if (finalTranscript) {
				setCurrentText((prev) => {
					const separator = prev.length > 0 && !prev.endsWith(" ") ? " " : "";
					return prev + separator + finalTranscript;
				});
			}
		};

		// biome-ignore lint/suspicious/noExplicitAny: event is not typed
		recognitionRef.current.onerror = (event: any) => {
			console.log("Speech recognition error:", event.error);

			if (event.error === "no-speech") {
				setIsRecording(false);
				showNotification("No speech detected. Stopped.");
				return;
			}

			if (event.error === "network") {
				setIsRecording(false);
				showNotification("Network error. Check connection.");
				return;
			}

			if (event.error === "not-allowed") {
				setIsRecording(false);
				showNotification("Microphone permission denied.");
				return;
			}

			setIsRecording(false);
		};

		recognitionRef.current.onend = () => {
			setIsRecording(false);
		};

		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			setNotes(JSON.parse(saved));
		}
	}, [showNotification]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
	}, [notes]);

	const toggleRecording = useCallback(() => {
		if (isRecording) {
			recognitionRef.current?.stop();
			setIsRecording(false);
		} else {
			try {
				recognitionRef.current?.start();
				setIsRecording(true);
			} catch (e) {
				console.error("Could not start recording:", e);
			}
		}
	}, [isRecording]);

	const handleAnalyze = async () => {
		if (!currentText.trim()) return;
		setIsAnalyzing(true);
		setSuggestions([]);
		try {
			const results = await checkGrammarAndStyle(currentText);
			setSuggestions(results);
			if (results.length === 0) {
				showNotification("Text looks good!");
			}
		} catch (_error) {
			showNotification("Analysis failed.");
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleRewrite = async (tone: Tone) => {
		if (!currentText.trim()) return;
		setIsRewriting(true);
		setSuggestions([]);
		try {
			const suggestion = await rewriteText(currentText, tone);
			setSuggestions([suggestion]);
			showNotification("Rewrite suggestion ready");
		} catch (_error) {
			showNotification("Rewrite failed.");
		} finally {
			setIsRewriting(false);
		}
	};

	const applySuggestion = (suggestion: GrammarSuggestion) => {
		if (suggestion.type === "rewrite") {
			setCurrentText(suggestion.correction);
		} else {
			setCurrentText((prev) =>
				prev.replace(suggestion.original, suggestion.correction),
			);
		}
		setSuggestions((prev) => prev.filter((s) => s !== suggestion));
	};

	const saveNote = async () => {
		if (!currentText.trim()) return;

		if (activeNoteId) {
			setNotes((prev) =>
				prev.map((n) =>
					n.id === activeNoteId ? { ...n, content: currentText } : n,
				),
			);
			showNotification("Saved");
		} else {
			const title = await generateTitle(currentText);
			const newNote: Note = {
				id: Date.now().toString(),
				title,
				content: currentText,
				createdAt: Date.now(),
			};
			setNotes((prev) => [newNote, ...prev]);
			setActiveNoteId(newNote.id);
			showNotification("Note created");
		}
	};

	const createNewNote = () => {
		setCurrentText("");
		setActiveNoteId(null);
		setSuggestions([]);
		setSidebarOpen(false);
	};

	const loadNote = (note: Note) => {
		setCurrentText(note.content);
		setActiveNoteId(note.id);
		setSuggestions([]);
		setSidebarOpen(false);
	};

	const deleteNote = (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		setNotes((prev) => prev.filter((n) => n.id !== id));
		if (activeNoteId === id) {
			createNewNote();
		}
	};

	return (
		<div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				createNewNote={createNewNote}
				notes={notes}
				loadNote={loadNote}
				activeNoteId={activeNoteId}
				deleteNote={deleteNote}
			/>

			{/* Main Content */}
			<div className="flex-1 flex flex-col relative min-w-0 bg-black">
				<Header
					setSidebarOpen={setSidebarOpen}
					activeNoteId={activeNoteId}
					notes={notes}
					saveNote={saveNote}
					currentText={currentText}
					showNotification={showNotification}
				/>

				{/* Editor Area */}
				<main className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
					<div className="flex-1 overflow-y-auto custom-scrollbar">
						<div className="max-w-3xl mx-auto py-12 px-6">
							<Editor
								value={currentText}
								onChange={setCurrentText}
								isRecording={isRecording}
							/>
						</div>
						{/* Bottom spacing for toolbar */}
						<div className="h-32"></div>
					</div>

					<AIPanel
						suggestions={suggestions}
						isAnalyzing={isAnalyzing}
						isRewriting={isRewriting}
						setSuggestions={setSuggestions}
						applySuggestion={applySuggestion}
					/>
				</main>

				<FloatingToolbar
					isRecording={isRecording}
					toggleRecording={toggleRecording}
					handleAnalyze={handleAnalyze}
					isAnalyzing={isAnalyzing}
					isRewriting={isRewriting}
					currentText={currentText}
					handleRewrite={handleRewrite}
				/>
			</div>

			{/* Toast Notification */}
			{notification && (
				<div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
					<div className="text-sm font-medium">{notification}</div>
				</div>
			)}
		</div>
	);
}

export default App;
