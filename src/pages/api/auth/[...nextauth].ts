import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../server/env.mjs";

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/auth/login",
	},
	// Include user.id on session
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	// debug: env.NODE_ENV !== "production",
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLECLIENT_ID,
			clientSecret: env.GOOGLECLIENT_SECRET,
		}),
		// ...add more providers here
	],
};

export default NextAuth(authOptions);
