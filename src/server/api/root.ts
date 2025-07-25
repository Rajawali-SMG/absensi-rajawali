import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { desaRouter } from "./routers/desa";
import { eventRouter } from "./routers/event";
import { generusRouter } from "./routers/generus";
import { kelompokRouter } from "./routers/kelompok";
import { logRouter } from "./routers/log";
import { loginRouter } from "./routers/login";
import { presenceRouter } from "./routers/presence";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	login: loginRouter,
	kelompok: kelompokRouter,
	desa: desaRouter,
	generus: generusRouter,
	event: eventRouter,
	log: logRouter,
	user: userRouter,
	presence: presenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
