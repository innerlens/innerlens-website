class Logger {
	static LEVELS = {
		ERROR: 0,
		WARN: 1,
		INFO: 2,
		DEBUG: 3,
		TRACE: 4,
	};

	static globalLevel = Logger.LEVELS.INFO;

	static setGlobalLevel(level) {
		if (typeof level === "string") {
			const upperLevel = level.toUpperCase();
			if (Logger.LEVELS[upperLevel] !== undefined) {
				Logger.globalLevel = Logger.LEVELS[upperLevel];
			}
		} else if (typeof level === "number" && level >= 0 && level <= 4) {
			Logger.globalLevel = level;
		}
		return Logger.globalLevel;
	}

	constructor(options = {}) {
		this.prefix = options.prefix || "";
		this.useColors =
			options.useColors !== undefined ? options.useColors : true;
		this.level =
			options.level !== undefined ? options.level : Logger.globalLevel;
	}

	setLevel(level) {
		if (typeof level === "string") {
			const upperLevel = level.toUpperCase();
			if (Logger.LEVELS[upperLevel] !== undefined) {
				this.level = Logger.LEVELS[upperLevel];
			}
		} else if (typeof level === "number" && level >= 0 && level <= 4) {
			this.level = level;
		}
		return this;
	}

	formatMessage(level, message) {
		const timestamp = new Date().toISOString();
		const levelName = Object.keys(Logger.LEVELS).find(
			(key) => Logger.LEVELS[key] === level
		);
		return `${timestamp} [${levelName}]${
			this.prefix ? ` [${this.prefix}]` : ""
		} ${message}`;
	}

	log(level, message, ...args) {
		if (level > this.level) return;

		const formattedMessage = this.formatMessage(level, message);

		let method;
		let styleStart = "";

		if (this.useColors) {
			switch (level) {
				case Logger.LEVELS.ERROR:
					method = "error";
					styleStart = "color: red; font-weight: bold;";
					break;
				case Logger.LEVELS.WARN:
					method = "warn";
					styleStart = "color: orange; font-weight: bold;";
					break;
				case Logger.LEVELS.INFO:
					method = "info";
					styleStart = "color: blue;";
					break;
				case Logger.LEVELS.DEBUG:
					method = "log";
					styleStart = "color: green;";
					break;
				case Logger.LEVELS.TRACE:
					method = "log";
					styleStart = "color: gray;";
					break;
				default:
					method = "log";
			}

			if (styleStart) {
				console[method](`%c${formattedMessage}`, styleStart, ...args);
			} else {
				console[method](formattedMessage, ...args);
			}
		} else {
			console[method || "log"](formattedMessage, ...args);
		}
	}

	error(message, ...args) {
		this.log(Logger.LEVELS.ERROR, message, ...args);
	}

	warn(message, ...args) {
		this.log(Logger.LEVELS.WARN, message, ...args);
	}

	info(message, ...args) {
		this.log(Logger.LEVELS.INFO, message, ...args);
	}

	debug(message, ...args) {
		this.log(Logger.LEVELS.DEBUG, message, ...args);
	}

	trace(message, ...args) {
		this.log(Logger.LEVELS.TRACE, message, ...args);
	}
}

export default Logger;
