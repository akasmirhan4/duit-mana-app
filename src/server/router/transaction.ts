import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TransactionCategory } from "@prisma/client";
import { openai } from "pages/api/openai";

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
		input: z.object({
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
				data: { ...input },
			});
		},
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
				orderBy: { date: "desc" },
			});
		},
	})
	.mutation("get-category", {
		input: z.object({
			description: z.string(),
		}),
		resolve: async ({ ctx, input }) => {
			if (!input || !ctx.session?.user?.id) return;
			console.log({ input });
			const transactionCategories = Object.values(TransactionCategory).join(", ");
			const prompt = `This is the list of transaction categories: ${transactionCategories}\nDescription: ${input.description}\nCategory:`;
			const response = await openai.createCompletion({
				model: "text-davinci-002",
				prompt,
				temperature: 0,
				max_tokens: 6,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
			});
			if (!response?.data.choices?.length) {
				throw new Error("No response");
			}
			console.log({ prompt, response: response?.data?.choices[0]?.text });
			const responseWordArray = response?.data?.choices[0]?.text?.toUpperCase().match(/\b(\w+)\b/g);
			if (!responseWordArray?.length) {
				throw new Error("No category in response");
			}
			for (let i = 0; i < responseWordArray.length; i++) {
				const word = responseWordArray[i] as keyof typeof TransactionCategory;
				if (TransactionCategory[word]) {
					return word;
				}
			}
			throw new Error("Invalid category: " + responseWordArray[0] + ". Please enter the category manually.");
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
