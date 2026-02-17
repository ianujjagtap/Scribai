import { Mic, Square } from "lucide-react";
import type React from "react";

interface RecordButtonProps {
	isRecording: boolean;
	onToggle: () => void;
	disabled?: boolean;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
	isRecording,
	onToggle,
	disabled,
}) => {
	return (
		<button
			type="button"
			onClick={onToggle}
			disabled={disabled}
			className={`
        relative group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border
        ${
					disabled
						? "border-zinc-800 bg-zinc-900 opacity-50 cursor-not-allowed text-zinc-500"
						: "cursor-pointer"
				}
        ${
					isRecording
						? "bg-red-600 border-red-600 text-white"
						: !disabled
							? "bg-black border-zinc-700 hover:border-white text-zinc-300 hover:text-white"
							: ""
				}
      `}
		>
			{isRecording && (
				<span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-50"></span>
			)}

			{isRecording ? (
				<Square className="w-5 h-5 fill-current" />
			) : (
				<Mic className="w-5 h-5" />
			)}
		</button>
	);
};
