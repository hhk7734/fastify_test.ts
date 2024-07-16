import { AsyncLocalStorage } from "node:async_hooks";
import pino, { type LoggerOptions } from "pino";
import { Option, type Command, type OptionValues } from "commander";

const LOG_LEVEL_KEY = "log_level";
const LOG_FORMAT_KEY = "log_format";

const defaultOpts: LoggerOptions = {
	formatters: {
		level: (label) => ({ level: label }),
		bindings: () => ({}),
	},
	timestamp: pino.stdTimeFunctions.isoTime,
};

const asyncLocalStorage = new AsyncLocalStorage<object>();
let globalLogger = pino.pino(defaultOpts);

export function addOption(cmd: Command) {
	cmd.addOption(
		new Option(`--${LOG_LEVEL_KEY} <level>`, `Log level`)
			.env(LOG_LEVEL_KEY.toUpperCase())
			.choices(["debug", "info", "warn", "error"])
			.default("info"),
	);
	cmd.addOption(
		new Option(`--${LOG_FORMAT_KEY} <format>`, `Log format`)
			.env(LOG_FORMAT_KEY.toUpperCase())
			.choices(["json", "pretty"])
			.default("json"),
	);
}

export function setGlobalLoggerWith(opts: OptionValues) {
	globalLogger.info(
		{ config: { [LOG_LEVEL_KEY]: opts[LOG_LEVEL_KEY], [LOG_FORMAT_KEY]: opts[LOG_FORMAT_KEY] } },
		"logger config",
	);

	const options = { ...defaultOpts, level: opts[LOG_LEVEL_KEY] };
	if (opts[LOG_FORMAT_KEY] === "pretty") {
		options.transport = { target: "pino-pretty", options: { singleLine: true } };
	}

	globalLogger = pino.pino(options);
}

export function logger() {
	const store = asyncLocalStorage.getStore();
	if (store) {
		return globalLogger.child(store);
	}

	return globalLogger;
}

export function withFields(fields: object, callbacke: () => Promise<void> | void) {
	const store = asyncLocalStorage.getStore() ?? {};
	asyncLocalStorage.run({ ...store, ...fields }, callbacke);
}
