const withPWA = require("next-pwa");

module.exports = withPWA({
	reactStrictMode: true,
	images: {
		domains: ["lh3.googleusercontent.com"],
	},
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
	},
});
