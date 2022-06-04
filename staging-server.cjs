const createServer = require("http-server").createServer;
const siteConfig = require("./public/staticwebapp.config.json");

const options = {
    gzip: true,
    brotli: true,
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
httpServer.listen(3000, "localhost", () => {
    const address = httpServer.server.address();
    console.info(`Server listening on: ${address.address}:${address.port}`);
});