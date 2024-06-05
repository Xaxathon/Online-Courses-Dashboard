/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				mainPurple: "#7130A3",
				statusSalate: "#779F7C",
				statusRed: "#C73535",
				inputPurple: "#e7e4ef",
			},
			backgroundImage: {
				"custom-gradient":
					"linear-gradient(180deg, rgba(208, 156, 250, 0.17) 0%, rgba(141, 244, 154, 0.14) 100%)",
			},
			boxShadow: {
				custom: "0px 4px 18px 0px rgba(0, 35, 123, 0.84);",
			},
			gridTemplateColumns: {
				"content-large": "440px 312px 140px 175px 178px",
				"content-small": "301px 179px 140px 124px 125px",
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
