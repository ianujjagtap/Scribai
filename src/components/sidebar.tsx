import { History, Plus, Trash2, X } from "lucide-react";
import type React from "react";
import type { Note } from "../types";

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
	createNewNote: () => void;
	notes: Note[];
	loadNote: (note: Note) => void;
	activeNoteId: string | null;
	deleteNote: (e: React.MouseEvent, id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
	sidebarOpen,
	setSidebarOpen,
	createNewNote,
	notes,
	loadNote,
	activeNoteId,
	deleteNote,
}) => {
	return (
		<div
			className={`fixed inset-y-0 left-0 z-30 w-72 bg-black border-r border-zinc-900 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
		>
			<div className="flex flex-col h-full">
				<div className="p-5 flex items-center justify-between">
					<div className="flex items-center gap-2 font-semibold text-white tracking-tight">
						<div className="w-5 h-5 bg-white rounded-full"></div>
						<span>ScribeAI</span>
					</div>
					<button
						type="button"
						onClick={() => setSidebarOpen(false)}
						className="md:hidden text-zinc-500 hover:text-white"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="px-3 pb-4">
					<button
						type="button"
						onClick={createNewNote}
						className="w-full py-2 px-3 bg-zinc-50 hover:bg-white text-black rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
					>
						<Plus className="w-4 h-4" />
						<span>New Note</span>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-3 space-y-1">
					<div className="text-xs font-medium text-zinc-500 px-3 py-2 uppercase tracking-wider">
						History
					</div>
					{notes.length === 0 && (
						<div className="text-center text-zinc-800 py-8">
							<History className="w-8 h-8 mx-auto mb-2 opacity-50" />
							<p className="text-xs">No notes</p>
						</div>
					)}
					{notes.map((note) => (
						<button
							type="button"
							key={note.id}
							onClick={() => loadNote(note)}
							className={`group relative py-2 px-3 rounded-md cursor-pointer transition-colors w-full text-left ${activeNoteId === note.id ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}
						>
							<div className="truncate text-sm font-medium pr-6">
								{note.title}
							</div>
							<button
								type="button"
								onClick={(e) => deleteNote(e, note.id)}
								className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity p-1"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
