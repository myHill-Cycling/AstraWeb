import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {createTransport} from "nodemailer";
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
	name: { type: "string", max: 100 },
	email: { type: "email", normalize: true, precise: true },
	subject: { type: "string" },
	message: { type: "string", optional: true }
};

const v = new Validator();

const MessageCheck = v.compile(MessageSchema);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest) {

	const parsed = new URLSearchParams(req.rawBody);
	const dto: DTO = {
		name: parsed.get("name"),
		email: parsed.get("email"),
		subject: parsed.get("subject"),
		message: parsed.get("message")
	};

	const passedChecks = await MessageCheck(dto);
	if(passedChecks !== true){
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
		name: process.env.CONTACT_ADDRESS_NAME ?? "Contact",
		address: process.env.CONTACT_ADDRESS_EMAIL ?? ""
	};

	const systemAddress: Address = {
		name: process.env.SYSTEM_ADDRESS_NAME ?? "System NO-REPLY",
		address: process.env.SYSTEM_ADDRESS_EMAIL ?? ""
	};

	const mailBuilder = new MailComposer({
		from: systemAddress,
		sender: systemAddress,
		to: contactUsAddress,
		replyTo: {
			name: msgData.name,
			address: msgData.email
		},
		subject: `${msgData.name} has a query! '${msgData.subject}'`,
		text: msgData.message ?? ""
	});

	const parsedSmtpPort = parseInt(process.env.SMTP_PORT ?? "");

	const mailTransport = createTransport({
		host: process.env.SMTP_HOST ?? "localhost",
		port: isNaN(parsedSmtpPort) ? 1025 : parsedSmtpPort,
		secure: false, // upgrade later with STARTTLS
		requireTLS: process.env.NODE_ENV === "production",
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		},
		logger: new SMTPLogger(context.log),
		transactionLog: true,
		debug: process.env.NODE_ENV === "development"
	});

	try {
		await mailTransport.sendMail(mailBuilder.mail);
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

	return {
		status: 200,
		body: {
			status: "success"
		}
	};
};

export default httpTrigger;
