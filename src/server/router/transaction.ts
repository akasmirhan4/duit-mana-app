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
				date: z.date().optional(),
			})
			.nullish(),
		resolve({ ctx, input }) {
			if (!input || !ctx.session?.user?.id) return;
			return ctx.prisma.transactionLog.create({
				data: { ...input, userId: ctx.session.user.id },
			});
		},
	})
	.mutation("delete", {
		input: z
			.object({
				id: z.number(),
			})
			.nullish(),
		resolve({ ctx, input }) {
			if (!input || !ctx.session?.user?.id) return;
			return ctx.prisma.transactionLog.delete({
				where: { id: input.id },
			});
		},
	})
	.mutation("update", {
		input: z
			.object({
				id: z.number(),
				category: z.nativeEnum(TransactionCategory),
				amount: z.number(),
				description: z.string(),
				date: z.date().optional(),
			}),
		resolve({ ctx, input }) {
			if (!input || !ctx.session?.user?.id) return;
			return ctx.prisma.transactionLog.update({
				where: { id: input.id },
				data: { ...input},
			});
		}
	})
	.query("get", {
		input: z
			.object({
				id: z.number(),
			})
			.nullish(),
		resolve({ ctx, input }) {
			if (!input || !ctx.session?.user?.id) return;
			return ctx.prisma.transactionLog.findFirst({
				where: { id: input.id, userId: ctx.session.user.id },
			});
		},
	})
	.query("list", {
		resolve: async ({ ctx }) => {
			if (!ctx.session?.user?.id) return;
			return await ctx.prisma.transactionLog.findMany({
				where: { userId: ctx.session.user.id },
				orderBy: { createdAt: "desc" },
			});
		},
	})
	.middleware(async ({ ctx, next }) => {
		// Any queries or mutations after this middleware will
		// raise an error unless there is a current session
		if (!ctx.session) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next();
	});
