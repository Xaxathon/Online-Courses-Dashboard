/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				mainPurple: "#7130A3",
				statusSalate: "#779F7C",
				statusRed: "#C73535",
			},
			maxWidth: {
				laptop: "1024px",
			},
			fontFamily: {
				baloo: ['"Baloo Bhai"', "cursive"],
				poppins: ["Poppins", "sans-serif"],
			},
		},
		fontFamily: {
			sans: ["Poppins", "sans-serif"],
		},
	},
	plugins: [],
};
