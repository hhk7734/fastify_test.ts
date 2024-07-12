import Koa from "koa";
import Router from "@koa/router";
import { logger } from "@/pkg/logger";
import { loggerMiddleware } from "@/userinterface/restapi/middleware/logger";

const app = new Koa();
const router = new Router();

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
