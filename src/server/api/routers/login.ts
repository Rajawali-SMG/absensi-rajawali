import { TRPCError } from "@trpc/server";
import { verify } from "argon2";
import { eq } from "drizzle-orm";
import { formatResponse } from "@/helper/response.helper";
import { loginSchema } from "@/types/auth";
import { user } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const loginRouter = createTRPCRouter({
	login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
		const data = await ctx.db.query.user.findFirst({
			where: eq(user.username, input.username),
		});
		if (!data || !(await verify(data.password!, input.password))) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Username atau kata sandi salah",
			});
		}

		return formatResponse(
			true,
			"Login berhasil",
			{ access_token: "token" },
			null,
		);
	}),
});
