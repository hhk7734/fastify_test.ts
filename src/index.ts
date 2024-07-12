import Koa from "koa";
import Router from "@koa/router";
import dotenv from "dotenv";
import { program } from "commander";
import * as logger from "@/pkg/logger";
import { loggerMiddleware } from "@/userinterface/restapi/middleware/logger";
import { requestIDMiddleware } from "./userinterface/restapi/middleware/requestID";

dotenv.config();

logger.addOption(program);

program.parse();

const opts = program.opts();

logger.setGlobalLoggerWith(opts);

const app = new Koa();
const router = new Router();

app.use(requestIDMiddleware);
app.use(loggerMiddleware);

router.get("/", (ctx) => {
	ctx.body = {
		hello: "world",
	};
});

app.use(router.routes());

app.listen(3000, () => {
	logger.logger().info("start");
});
