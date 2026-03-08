import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

export function InstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<
		| (Event & {
				prompt?: () => void;
				userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
		  })
		| null
	>(null);
	const [showPrompt, setShowPrompt] = useState(false);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setShowPrompt(true);
		};

		const handlePwaInstallable = () => {
			if (window.deferredPrompt) {
				setDeferredPrompt(window.deferredPrompt);
				setShowPrompt(true);
			}
		};

		// Check if it already fired before mount
		if (window.deferredPrompt) {
			setDeferredPrompt(window.deferredPrompt);
			setShowPrompt(true);
		}

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("pwa-installable", handlePwaInstallable);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("pwa-installable", handlePwaInstallable);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		} else {
			console.log("User dismissed the install prompt");
		}

		// We've used the prompt, and can't use it again, throw it away
		setDeferredPrompt(null);
		setShowPrompt(false);
	};

	if (!showPrompt) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 shadow-lg z-50 flex items-center justify-between animate-in slide-in-from-bottom-full duration-500">
			<div className="flex items-center gap-4">
				<div className="w-12 h-12 bg-black rounded-xl border border-zinc-800 flex items-center justify-center shrink-0">
					<svg
						width="24"
						height="24"
						viewBox="0 0 512 512"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>PWA Icon</title>
						<rect
							x="156"
							y="100"
							width="200"
							height="280"
							rx="20"
							fill="none"
							stroke="#ffffff"
							strokeWidth="32"
						/>
						<path
							d="M156 180H356"
							fill="none"
							stroke="#ffffff"
							strokeWidth="32"
						/>
						<path
							d="M256 340V340.01"
							fill="none"
							stroke="#ffffff"
							strokeWidth="40"
							strokeLinecap="round"
						/>
					</svg>
				</div>
				<div>
					<h3 className="text-white font-medium">ScribeAI</h3>
					<p className="text-zinc-400 text-sm">
						Install app for a better experience
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setShowPrompt(false)}
					className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
					aria-label="Close prompt"
				>
					<X size={20} />
				</button>
				<button
					type="button"
					onClick={handleInstallClick}
					className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors"
				>
					<Download size={16} />
					Install
				</button>
			</div>
		</div>
	);
}
