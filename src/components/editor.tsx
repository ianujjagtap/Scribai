import type React from "react";
import { useEffect, useRef } from "react";

interface EditorProps {
	value: string;
	onChange: (value: string) => void;
	isRecording: boolean;
}

export const Editor: React.FC<EditorProps> = ({
	value,
	onChange,
	isRecording,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: value dependency is correct
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, [value]);

	return (
		<div className="relative w-full max-w-3xl mx-auto">
			<textarea
				ref={textareaRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={
					isRecording ? "Listening..." : "Start typing or recording..."
				}
				className="w-full bg-transparent text-lg text-zinc-100 placeholder-zinc-700 resize-none outline-none min-h-[60vh] leading-relaxed py-4 font-light tracking-wide"
				spellCheck="false"
				// biome-ignore lint/a11y/noAutofocus: intentional
				autoFocus
			/>
			{isRecording && (
				<div className="fixed top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-xl z-50">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
					</span>
					<span className="text-xs font-mono text-zinc-400">REC</span>
				</div>
			)}
		</div>
	);
};
