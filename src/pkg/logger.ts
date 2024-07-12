import { AsyncLocalStorage } from "node:async_hooks";
import pino from "pino";

const asyncLocalStorage = new AsyncLocalStorage<object>();
const _logger = pino({
	formatters: {
		level: (label) => ({ level: label }),
		bindings: () => ({}),
	},
	timestamp: pino.stdTimeFunctions.isoTime,
});

export function logger() {
	const store = asyncLocalStorage.getStore();
	if (store) {
		return _logger.child(store);
	}

	return _logger;
}

export function withFields(fields: object, callbacke: () => Promise<void> | void) {
	const store = asyncLocalStorage.getStore() ?? {};
	asyncLocalStorage.run({ ...store, ...fields }, callbacke);
}
