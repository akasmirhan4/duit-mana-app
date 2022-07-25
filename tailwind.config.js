/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"radial": "radial-gradient(var(--tw-gradient-stops))",
			},
      fontFamily:{
        'sans': ['Poppins', 'sans-serif'],
      }
		},
	},
	plugins: [],
};
