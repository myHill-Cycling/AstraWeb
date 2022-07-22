import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {createTransport, SentMessageInfo} from "nodemailer";
import MailComposer from "nodemailer/lib/mail-composer";
import { Address } from "nodemailer/lib/mailer";
import { SMTPLogger } from "./SMTPLogger";
import Validator, { ValidationSchema } from "fastest-validator";

type DTO = {
	name: string | null,
	email: string | null,
	subject: string | null,
	message: string | null
}

type MessageData = {
	name: string,
	email: string,
	subject: string,
	message: string | null
}

const MessageSchema: ValidationSchema<MessageData> = {
	name: { type: "string", max: 100, empty: false, trim: true },
	email: { type: "email", normalize: true, precise: true, empty: false, trim: true },
	subject: { type: "string", empty: false, trim: true },
	message: { type: "string", optional: true }
};

const v = new Validator();

const MessageCheck = v.compile(MessageSchema);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest) {

	context.log.info("Started processing form trigger");
	let dto: DTO;
	try {
		const parsed = new URLSearchParams(req.rawBody);
		dto = {
			name: parsed.get("name"),
			email: parsed.get("email"),
			subject: parsed.get("subject"),
			message: parsed.get("message")
		};
		context.log.info("Parsed data from request", dto);
	}
	catch(e) {
		return {
			status: 400,
			body: {
				status: "parsing-error"
			}
		};
	}

	const passedChecks = await MessageCheck(dto);
	if(passedChecks !== true){
		context.log.warn("Request data failed validation!", passedChecks);
		return {
			status: 400,
			body: {
				status: "validation-error",
				errors: passedChecks
			}
		};
	}

	const msgData = dto as MessageData;

	const contactUsAddress: Address = {
		/* c8 ignore next */
		name: process.env.CONTACT_ADDRESS_NAME ?? "Contact",
		/* c8 ignore next */
		address: process.env.CONTACT_ADDRESS_EMAIL ?? ""
	};

	context.log.info("Address that the message will be sent to, ", contactUsAddress);

	const systemAddress: Address = {
		/* c8 ignore next */
		name: process.env.SYSTEM_ADDRESS_NAME ?? "System NO-REPLY",
		/* c8 ignore next */
		address: process.env.SYSTEM_ADDRESS_EMAIL ?? ""
	};

	context.log.info("Address that the message will be sent from, ", systemAddress);

	const userAddress: Address = {
		name: msgData.name,
		address: msgData.email
	};

	const mailBuilder = new MailComposer({
		from: systemAddress,
		sender: userAddress,
		to: contactUsAddress,
		replyTo: userAddress,
		subject: `${msgData.name} has a query! '${msgData.subject}'`,
		text: msgData.message ?? ""
	});

	/* c8 ignore next */
	const parsedSmtpPort = parseInt(process.env.SMTP_PORT ?? "");

	const transportConfig = {
		/* c8 ignore next */
		host: process.env.SMTP_HOST ?? "localhost",
		/* c8 ignore next */
		port: isNaN(parsedSmtpPort) ? 1025 : parsedSmtpPort,
		secure: false, // upgrade later with STARTTLS
		requireTLS: process.env.NODE_ENV === "production",
		transactionLog: true,
		debug: process.env.NODE_ENV === "development"
	};

	context.log.info("SMTP Connection configuration", transportConfig);

	const mailTransport = createTransport({
		...transportConfig,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		},
		logger: new SMTPLogger(context.log)
	});

	let response: SentMessageInfo;
	try {
		context.log.info("Sending mail", mailBuilder.mail);
		response = await mailTransport.sendMail(mailBuilder.mail);
	}
	catch (e) {
		context.log.error("An error ocurred while sending the email.", e);
		return {
			status: 500,
			body: {
				status: "send-error"
			}
		};
	}

	const returnObj: {
		status: 200,
		body: {
			status: "success",
			response?: SentMessageInfo
		}
	} = {
		status: 200,
		body: {
			status: "success"
		}
	};

	if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
		returnObj.body.response = response;
	}

	context.log.info("Closing SMTP connection");
	mailTransport.close();

	context.log.info("Response to submission", returnObj);
	return returnObj;
};

export default httpTrigger;
