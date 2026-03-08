import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
	return {
		server: {
			port: 3000,
			host: "0.0.0.0",
		},
		plugins: [
			react(),
			VitePWA({
				registerType: "autoUpdate",
				includeAssets: ["pwa-icon.svg"],
				manifest: {
					name: "ScribeAI",
					short_name: "ScribeAI",
					description: "Progressive Web App for ScribeAI",
					theme_color: "#000000",
					background_color: "#000000",
					display: "standalone",
					start_url: "/",
					icons: [
						{
							src: "pwa-icon.svg",
							sizes: "192x192",
							type: "image/svg+xml",
						},
						{
							src: "pwa-icon.svg",
							sizes: "512x512",
							type: "image/svg+xml",
						},
						{
							src: "pwa-icon.svg",
							sizes: "512x512",
							type: "image/svg+xml",
							purpose: "any maskable",
						},
					],
				},
				devOptions: {
					enabled: true,
				},
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
