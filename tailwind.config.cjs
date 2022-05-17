const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: [
		"./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}",
		"./node_modules/flowbite/**/*.js"
	],
	darkMode: "class",
	theme: {
		colors: {
			brand: "#f70702",
			"brand-contrast": colors.white,
			"dark-mode-foreground": colors.white,
		},
		extend: {
			fontFamily: {
			  sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
			},
		  }
	},
	plugins: [
		require("flowbite/plugin")
	]
};
