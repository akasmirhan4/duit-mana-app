/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

const colors = {
	primary: "#320541",
	secondary: "#1B0536",
};

module.exports = {
	mode: "jit",
	purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				radial: "radial-gradient(var(--tw-gradient-stops))",
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
			},
			colors,
		},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				".no-scrollbar::-webkit-scrollbar": {
					display: "none",
				},
				".no-scrollbar": {
					"-ms-overflow-style": "none",
					"scrollbar-width": "none",
				},
				".custom-scrollbar": {
					"scrollbar-width": "auto",
					"scrollbar-color": "#FFFFFF20 transparent",
				},
				".custom-scrollbar::-webkit-scrollbar": {
					width: "4px",
				},
				".custom-scrollbar::-webkit-scrollbar-track": {
					background: "transparent",
				},
				".custom-scrollbar::-webkit-scrollbar-thumb": {
					"background-color": "#FFFFFF20",
					"border-radius": "10px",
					border: "3px #FFFFF transparent",
				},
			});
		}),
	],
};
