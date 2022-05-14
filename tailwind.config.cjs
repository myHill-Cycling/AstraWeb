const colors = require("tailwindcss/colors");

module.exports = {
	content: [
		"./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}",
		"./node_modules/flowbite/**/*.js"
	],
	darkMode: "class",
	theme: {
		colors: {
			brand: "#f70702",
			"brand-contrast": colors.white
		},
		extend: {},
	},
	plugins: [
		require("flowbite/plugin")
	]
};
