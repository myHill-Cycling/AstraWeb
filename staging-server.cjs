const createServer = require("http-server").createServer;
const siteConfig = require("./dist/staticwebapp.config.json");

const options = {
	gzip: true,
	brotli: true,
	cors: true,
	root: "./dist",
	logFn: (req, res, err) => {
		if(err){
			console.error(err);
		}
		else{
			console.info(`${res.statusCode} - ${req.method} ${req.url}`);
		}
	},
	headers: siteConfig.globalHeaders
};

console.debug("Running server with configuration: ", options);

const httpServer = createServer(options);
httpServer.listen(process.env.ASTRAWEB_PORT ?? 3000, process.env.ASTRAWEB_ADDRESS ?? "localhost", () => {
	const address = httpServer.server.address();
	console.info(`Server listening on: ${address.address}:${address.port}`);
});