import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

declare global {
	interface Window {
		deferredPrompt?: Event & { prompt?: () => void; userChoice?: Promise<{ outcome: "accepted" | "dismissed" }> };
	}
}

// Capture the event as early as possible to avoid race conditions
window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	window.deferredPrompt = e;
	// Dispatch a custom event so the React component can know it changed
	window.dispatchEvent(new Event("pwa-installable"));
});

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
