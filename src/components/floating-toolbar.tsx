import { Sparkles, Wand2 } from "lucide-react";
import type React from "react";
import { Tone } from "../types";
import { RecordButton } from "./record-button";

interface FloatingToolbarProps {
	isRecording: boolean;
	toggleRecording: () => void;
	handleAnalyze: () => void;
	isAnalyzing: boolean;
	isRewriting: boolean;
	currentText: string;
	handleRewrite: (tone: Tone) => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
	isRecording,
	toggleRecording,
	handleAnalyze,
	isAnalyzing,
	isRewriting,
	currentText,
	handleRewrite,
}) => {
	return (
		<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
			<div className="flex items-center p-1.5 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-full shadow-2xl">
				{/* Record Button */}
				<RecordButton isRecording={isRecording} onToggle={toggleRecording} />

				<div className="w-px h-8 bg-zinc-800 mx-2"></div>

				{/* Actions */}
				<div className="flex items-center gap-1 pr-2">
					<button
						type="button"
						onClick={handleAnalyze}
						disabled={isAnalyzing || isRewriting || !currentText}
						className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all disabled:opacity-30 relative group"
						title="Analyze Grammar"
					>
						<Sparkles className="w-5 h-5" />
					</button>

					<div className="relative group">
						<button
							type="button"
							disabled={isAnalyzing || isRewriting || !currentText}
							className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all disabled:opacity-30"
							title="Rewrite"
						>
							<Wand2 className="w-5 h-5" />
						</button>

						{/* Minimalist Dropup */}
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1">
							{[Tone.PROFESSIONAL, Tone.CASUAL, Tone.CONCISE].map((tone) => (
								<button
									type="button"
									key={tone}
									onClick={() => handleRewrite(tone)}
									className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
								>
									{tone}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
