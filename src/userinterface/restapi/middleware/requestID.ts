import { withFields } from "@/pkg/logger.js";
import type { Context, Next } from "koa";
import { v4 as uuid } from "uuid";

export function requestIDMiddleware(ctx: Context, next: Next) {
	let requestID = ctx.request.header["x-request-id"];
	if (!requestID) {
		requestID = uuid();
		ctx.request.header["x-request-id"] = requestID;
	}
	ctx.response.set("X-Request-Id", requestID);

	withFields({ request_id: requestID }, next);
}
