import { Check, Copy, Menu } from "lucide-react";
import type React from "react";
import type { Note } from "../types";

interface HeaderProps {
	setSidebarOpen: (open: boolean) => void;
	activeNoteId: string | null;
	notes: Note[];
	saveNote: () => void;
	currentText: string;
	showNotification: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
	setSidebarOpen,
	activeNoteId,
	notes,
	saveNote,
	currentText,
	showNotification,
}) => {
	return (
		<header className="h-14 flex items-center justify-between px-6 border-b border-zinc-900 bg-black/80 backdrop-blur-md z-20">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="md:hidden text-zinc-400"
				>
					<Menu className="w-5 h-5" />
				</button>
				<span className="text-sm font-medium text-zinc-400">
					{activeNoteId ? "Editing" : "Drafting"} /{" "}
					<span className="text-white">
						{activeNoteId
							? notes.find((n) => n.id === activeNoteId)?.title
							: "Untitled"}
					</span>
				</span>
			</div>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={saveNote}
					className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-zinc-900"
				>
					<Check className="w-3.5 h-3.5" /> Save
				</button>
				<button
					type="button"
					onClick={() => {
						navigator.clipboard.writeText(currentText);
						showNotification("Copied");
					}}
					className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-zinc-900"
				>
					<Copy className="w-3.5 h-3.5" /> Copy
				</button>
			</div>
		</header>
	);
};
