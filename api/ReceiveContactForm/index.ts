import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest) {
	context.log('HTTP trigger function processed a request.');
	const formData = req.parseFormBody();
	context.log(req);
	context.log(formData);
	return {
		body: req
	};

};

export default httpTrigger;
