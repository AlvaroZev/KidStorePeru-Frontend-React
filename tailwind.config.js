/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				burbankBig: ['BurbankBig', 'sans-serif'],
				burbankMedium: ['BurbankSmallMedium', 'sans-serif'],
				burbankBold: ['BurbankSmallBold', 'sans-serif'],
				burbankBlack: ['BurbankSmallBlack', 'sans-serif'],
			  },
		},
	},
	plugins: [],
};
