export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				mainPurple: "#7130A3",
				gardenGreen: "#779F7C",
				crimsonRed: "#C73535",
				lightPurple: "#e7e4ef",
				lightPurpleHover: "#D4C7F5",
				gardenGreenHover: "#8DB08D",
				crimsonRedHover: "#D94848",
				mainPurpleHover: "#592383",
				mainPurpleActive: "#943CD7",
			},
			backgroundImage: {
				"custom-gradient":
					"linear-gradient(180deg, rgba(208, 156, 250, 0.17) 0%, rgba(141, 244, 154, 0.14) 100%)",
				"time-gradient":
					"linear-gradient(180deg, rgba(208, 156, 250, 0.49) 0%, rgba(231, 249, 255, 0.61) 100%)",
				"add-gradient":
					"linear-gradient(180deg, rgba(153, 55, 231, 1) 0%, rgba(78, 190, 197, 1) 100%)",
			},
			minHeight: {
				dynamic: "clamp(500px, calc(100vh - 60px), 100vh)",
			},

			boxShadow: {
				custom: "0px 4px 18px 0px rgba(0, 35, 123, 0.84);",
				effect: "0px 0px 21.057px rgba(144, 52, 199, 0.36)",
			},
			gridTemplateColumns: {
				"5-protocol-cols":
					"minmax(18.75rem, 27.5rem) minmax(11.125rem, 19.5rem) minmax(8.75rem, 8.75rem) minmax(7.75rem, 10.9375rem) minmax(7.75rem, 11.125rem)",
			},

			borderColor: {
				effect: "rgba(135, 87, 164, 0.10)",
			},
			fontFamily: {
				baloo: ['"Baloo Bhai"', "cursive"],
				poppins: ["Poppins", "sans-serif"],
			},
			keyframes: {
				"fade-in-out": {
					"0%": { opacity: "0" },
					"10%": { opacity: "1" },
					"90%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
			},
			animation: {
				"fade-in-out": "fade-in-out 5s ease-in-out",
			},
		},
		fontFamily: {
			sans: ["Poppins", "sans-serif"],
		},
	},
	plugins: [],
};
