import { X } from "lucide-react";
import type React from "react";
import type { GrammarSuggestion } from "../types";
import { SuggestionCard } from "./suggestion-card";

interface AIPanelProps {
	suggestions: GrammarSuggestion[];
	isAnalyzing: boolean;
	isRewriting: boolean;
	setSuggestions: React.Dispatch<React.SetStateAction<GrammarSuggestion[]>>;
	applySuggestion: (suggestion: GrammarSuggestion) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
	suggestions,
	isAnalyzing,
	isRewriting,
	setSuggestions,
	applySuggestion,
}) => {
	if (suggestions.length === 0 && !isAnalyzing && !isRewriting) return null;

	return (
		<div className="w-full md:w-80 border-l border-zinc-900 bg-black p-4 overflow-y-auto custom-scrollbar md:block absolute md:relative z-20 h-1/2 md:h-full bottom-0 border-t md:border-t-0 shadow-2xl md:shadow-none">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest">
					Optimization
				</h3>
				<button
					type="button"
					onClick={() => setSuggestions([])}
					className="md:hidden"
				>
					<X className="w-4 h-4 text-zinc-500" />
				</button>
			</div>

			{isAnalyzing || isRewriting ? (
				<div className="space-y-3">
					<div className="h-4 w-2/3 bg-zinc-900/50 rounded animate-pulse mb-2"></div>
					<div className="h-24 bg-zinc-900/50 rounded-lg animate-pulse"></div>
				</div>
			) : (
				<div className="space-y-2">
					{suggestions.map((suggestion, idx) => (
						<SuggestionCard
							// biome-ignore lint/suspicious/noArrayIndexKey: simple list
							key={idx}
							suggestion={suggestion}
							onApply={applySuggestion}
							onDismiss={() =>
								setSuggestions((prev) => prev.filter((_, i) => i !== idx))
							}
						/>
					))}
				</div>
			)}
		</div>
	);
};
