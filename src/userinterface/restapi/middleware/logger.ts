import { logger, withFields } from "@/pkg/logger";
import { Context, Next } from "koa";

export async function loggerMiddleware(ctx: Context, next: Next) {
	const start = Date.now();
	const url = ctx.path;
	let error: Error | undefined | unknown;

	try {
		await next();
	} catch (err) {
		error = err;
	}

	const latency = (Date.now() - start) / 1000;

	withFields(
		{
			method: ctx.method,
			url,
			status: ctx.status,
			remote_address: ctx.request.ip,
			user_agent: ctx.request.header["user-agent"] ?? "",
			latency,
		},
		() => {
			logger().info("request");

			if (error) {
				logger().error(error, "unknown error");
			}
		},
	);
}
