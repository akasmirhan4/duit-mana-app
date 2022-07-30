import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TransactionCategory } from "@prisma/client";

export const transactionRouter = createRouter()
	.mutation("add", {
		input: z
			.object({
				category: z.nativeEnum(TransactionCategory),
				amount: z.number().default(0),
				description: z.string(),
			})
			.nullish(),
		async resolve({ ctx, input }) {
			if (!input || !ctx.session?.user?.id) return;
			return await ctx.prisma.transactionLog.create({
				data: { ...input, userId: ctx.session.user.id },
			});
		},
	}).query("list", {
		resolve: async ({ ctx }) => {
			if (!ctx.session?.user?.id) return;
			return await ctx.prisma.transactionLog.findMany({
				where: { userId: ctx.session.user.id },
				orderBy: { createdAt: "desc" },
			});
		}
	})
	.middleware(async ({ ctx, next }) => {
		// Any queries or mutations after this middleware will
		// raise an error unless there is a current session
		if (!ctx.session) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next();
	});
