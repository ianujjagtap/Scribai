import { Check, PenTool, RefreshCw, SpellCheck, Wand2, X } from "lucide-react";
import type React from "react";
import type { GrammarSuggestion } from "../types";

interface SuggestionCardProps {
	suggestion: GrammarSuggestion;
	onApply: (suggestion: GrammarSuggestion) => void;
	onDismiss: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
	suggestion,
	onApply,
	onDismiss,
}) => {
	const getIcon = () => {
		switch (suggestion.type) {
			case "grammar":
				return <Wand2 className="w-3.5 h-3.5" />;
			case "spelling":
				return <SpellCheck className="w-3.5 h-3.5" />;
			case "style":
				return <PenTool className="w-3.5 h-3.5" />;
			case "rewrite":
				return <RefreshCw className="w-3.5 h-3.5" />;
		}
	};

	return (
		<div className="p-3 mb-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors group animate-in fade-in slide-in-from-right-2">
			<div className="flex items-start justify-between mb-2">
				<div className="flex items-center gap-2 text-zinc-400">
					{getIcon()}
					<span className="text-[10px] font-mono uppercase tracking-widest">
						{suggestion.type}
					</span>
				</div>
				<button
					type="button"
					onClick={onDismiss}
					className="text-zinc-500 hover:text-zinc-300 transition-colors"
				>
					<X className="w-3.5 h-3.5" />
				</button>
			</div>

			{suggestion.type === "rewrite" ? (
				<div className="space-y-2 mb-3">
					<div className="text-sm font-light text-zinc-300 leading-relaxed bg-black/50 p-2 rounded border border-zinc-800/50 max-h-60 overflow-y-auto custom-scrollbar">
						{suggestion.correction}
					</div>
				</div>
			) : (
				<div className="space-y-1 mb-3">
					<div className="text-sm text-zinc-500 line-through decoration-zinc-700">
						{suggestion.original}
					</div>
					<div className="text-sm font-medium text-white">
						{suggestion.correction}
					</div>
				</div>
			)}

			<div className="text-xs text-zinc-500 mb-3 font-medium">
				{suggestion.explanation}
			</div>

			<button
				type="button"
				onClick={() => onApply(suggestion)}
				className="flex items-center justify-center w-full gap-2 py-1.5 px-3 bg-zinc-100 hover:bg-white text-black rounded text-xs font-semibold transition-colors"
			>
				<Check className="w-3 h-3" />
				{suggestion.type === "rewrite" ? "Apply Rewrite" : "Accept"}
			</button>
		</div>
	);
};
