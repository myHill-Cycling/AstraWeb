import { Context } from "@azure/functions";
import { itProp, fc } from "@fast-check/jest";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import fetch from "node-fetch";
import { simpleParser} from "mailparser";

import func from "./index";
import { join } from "path";

function hasWhiteSpace(s: string): boolean {
	return (/\s/).test(s);
}

function encode(data: Record<string, string>): string {
	return new URLSearchParams(data).toString();
}

function mockTransport() {
	return jest.spyOn(nodemailer, "createTransport")
		.mockImplementation((_opts: unknown) => {
			return {
				sendMail: jest.fn(),
				close: jest.fn()
			} as unknown as Mail;
		});
}

const defaultContext = {
	log: {
		verbose: jest.fn((args) => {
			console.debug(args);
		}),
		info: jest.fn((args) => {
			console.info(args);
		}),
		warn: jest.fn((args) => {
			console.warn(args);
		}),
		error: jest.fn((args) => {
			console.error(args);
		}),
	}
} as unknown as Context;

describe("Client data validation", () => {
	itProp("should validate", [fc.string({minLength: 1}).filter(s => !hasWhiteSpace(s)), fc.emailAddress(), fc.fullUnicodeString({minLength: 1}).filter(s => !hasWhiteSpace(s)), fc.fullUnicodeString().filter(s => !hasWhiteSpace(s))], async (name, email, subject, message) => {
		const req = {
			rawBody: encode({
				name, email, subject, message
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 200,
			body: {
				status: "success",
				response: undefined
			}
		});
	});

	itProp("Should reject invalid e-mail addresses", [fc.asciiString()], async (email) => {
		const req = {
			rawBody: encode({
				name: "Bob", email: email, subject: "subject", message: "message"
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result.status).toBe(400);
		expect(result.body.status).toBe("validation-error");
		expect(result.body.errors).toHaveLength(1);
		expect(result.body.errors[0].field).toBe("email");
	});

	it("Should not accept missing subject", async () => {
		const req = {
			rawBody: encode({
				name: "Bob", email: "bob@example.com", message: "message"
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 400,
			body: {
				status: "validation-error",
				errors: [
					{
						type: "required",
						message: "The 'subject' field is required.",
						field: "subject",
						actual: null
					}
				]
			}
		});
	});

	it("Should not accept blank subject", async () => {
		const req = {
			rawBody: encode({
				name: "Bob", email: "bob@example.com", message: "message", subject: " "
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 400,
			body: {
				status: "validation-error",
				errors: [
					{
						type: "stringEmpty",
						message: "The 'subject' field must not be empty.",
						field: "subject",
						actual: ""
					}
				]
			}
		});
	});

	it("Should not accept missing email", async () => {
		const req = {
			rawBody: encode({
				name: "Bob", subject: "subject", message: "message"
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 400,
			body: {
				status: "validation-error",
				errors: [
					{
						type: "required",
						message: "The 'email' field is required.",
						field: "email",
						actual: null
					}
				]
			}
		});
	});

	it("Should not accept blank email", async () => {
		const req = {
			rawBody: encode({
				name: "Bob", subject: "subject", message: "message", email: " "
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 400,
			body: {
				status: "validation-error",
				errors: [
					{
						type: "email",
						message: "The 'email' field must be a valid e-mail.",
						field: "email",
						actual: ""
					}
				]
			}
		});
	});

	it("Should not accept missing name", async () => {
		const req = {
			rawBody: encode({
				subject: "subject", email: "bob@example.com", message: "message"
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 400,
			body: {
				status: "validation-error",
				errors: [
					{
						type: "required",
						message: "The 'name' field is required.",
						field: "name",
						actual: null
					}
				]
			}
		});
	});

	it("Should not accept blank name", async () => {
		const req = {
			rawBody: encode({
				subject: "subject", email: "bob@example.com", message: "message", name: " "
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 400,
			body: {
				status: "validation-error",
				errors: [
					{
						type: "stringEmpty",
						message: "The 'name' field must not be empty.",
						field: "name",
						actual: ""
					}
				]
			}
		});
	});

	it("Should accept missing message", async () => {
		const req = {
			rawBody: encode({
				name: "Bob", email: "bob@example.com", subject: "subject"
			})
		};

		mockTransport();

		const result = await func(defaultContext, req);

		expect(result).toStrictEqual({
			status: 200,
			body: {
				status: "success",
				response: undefined
			}
		});
	});
});

test("Mail server failure gracefully handled", async () => {
	const req = {
		rawBody: encode({
			name: "Bob", email: "bob@example.com", subject: "subject"
		})
	};

	jest.spyOn(nodemailer, "createTransport")
		.mockImplementation((_opts) => {
			return {
				sendMail: (_mailOptions: unknown) => {
					throw new Error("Test Error");
				}
			} as unknown as Mail;
		});

	const result = await func(defaultContext, req);

	expect(result).toStrictEqual({
		status: 500,
		body: {
			status: "send-error"
		}
	});
});

describe("Etheral Tests", () => {
	let testAccount: nodemailer.TestAccount;
	beforeAll(async () => {
		testAccount = await nodemailer.createTestAccount();
		process.env.SMTP_HOST = testAccount.smtp.host;
		process.env.SMTP_PORT = testAccount.smtp.port.toString();
		process.env.SMTP_USER = testAccount.user;
		process.env.SMTP_PASS = testAccount.pass;
		process.env.CONTACT_ADDRESS_EMAIL = "contact@example.com";
		process.env.SYSTEM_ADDRESS_EMAIL = "system@example.com";
	});

	itProp("Expected E-Mail sent", [fc.asciiString({minLength: 1}).filter(s => !hasWhiteSpace(s)), fc.emailAddress(), fc.asciiString({minLength: 1}).filter(s => !hasWhiteSpace(s)), fc.asciiString({minLength: 1}).filter(s => !hasWhiteSpace(s))], async (name, email, subject, message) => {

		name = name.trim();

		const req = {
			rawBody: encode({
				name, email, subject, message
			})
		};
	
		const result = await func(defaultContext, req);

		expect(result.status).toBe(200);
		expect(result.body.status).toBe("success");
		expect(result.body.response).toBeTruthy();
	
		const emailUrl = nodemailer.getTestMessageUrl(result.body.response);
	
		if(!emailUrl) {
			throw new Error("Test failed! Unable to get test message URL from response.");
		}
	
		const fileUrl = new URL(emailUrl);
		fileUrl.pathname = join(fileUrl.pathname, "/message.eml");

		const emailData = await (await fetch(fileUrl.toString())).text();

		const parsedEmail = await simpleParser(emailData);
		
		expect(parsedEmail.replyTo?.value).toStrictEqual([{address: email, name: name}]);
		expect(parsedEmail.subject).toBe(`${name} has a query! '${subject}'`);
		expect(parsedEmail.text?.trim()).toStrictEqual(message?.trim());
	}, {
		numRuns: 1
	});
});
