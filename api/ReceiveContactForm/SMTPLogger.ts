import { Logger } from "@azure/functions";

export class SMTPLogger {
	private TRACE = 10;
	private DEBUG = 20;
	private INFO = 30;
	private WARN = 40;
	private ERROR = 50;
	private FATAL = 60;

	private levelFromName = {
		'trace': this.TRACE,
		'debug': this.DEBUG,
		'info': this.INFO,
		'warn': this.WARN,
		'error': this.ERROR,
		'fatal': this.FATAL
	};

	private logger: Logger;

	constructor(logger: Logger) {
		this.logger = logger;
	}

	private _level: number = this.TRACE;

	level(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal') {
		this._level = this.levelFromName[level];
	}
	trace(...params: any[]) {
		if (this._level >= this.TRACE) {
			this.logger.verbose(params);
		}
	}
	debug(...params: any[]) {
		if (this._level >= this.DEBUG) {
			this.logger.verbose(params);
		}
	}
	info(...params: any[]) {
		if (this._level >= this.INFO) {
			this.logger.info(params);
		}
	}
	warn(...params: any[]) {
		if (this._level >= this.WARN) {
			this.logger.warn(params);
		}
	}
	error(...params: any[]) {
		if (this._level >= this.ERROR) {
			this.logger.error(params);
		}
	}
	fatal(...params: any[]) {
		if (this._level >= this.ERROR) {
			this.logger.error(params);
		}
	}
}
