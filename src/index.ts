import Koa from "koa";
import Router from "@koa/router";
import { logger } from "@/pkg/logger";
import { loggerMiddleware } from "@/userinterface/restapi/middleware/logger";
import { requestIDMiddleware } from "./userinterface/restapi/middleware/requestID";

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
	logger().info("start");
});
