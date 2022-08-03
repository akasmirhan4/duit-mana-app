/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				radial: "radial-gradient(var(--tw-gradient-stops))",
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
			},
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
				".custom-scrollbar":{
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
