import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { CustomButton } from "components/form";
import { Session } from "next-auth";
import { getAuthSession } from "server/common/get-server-session";
import { PrismaClient, TransactionLog } from "@prisma/client";
import { useRouter } from "next/router";
import {  FiX } from "react-icons/fi";
import EditForm from "components/form/EditForm";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const transactionID = Number(ctx.query.id);
	const session = await getAuthSession(ctx);
	if (!transactionID) {
		return {
			redirect: {
				destination: "/?error=missing-transaction-id",
				statusCode: 302,
			},
		};
	}
	if (isNaN(transactionID)) {
		return {
			redirect: {
				destination: "/?error=invalid-transaction-id",
				statusCode: 302,
			},
		};
	}
	if (!session?.user) {
		return {
			redirect: {
				destination: "/auth/login/?error=login-required",
				statusCode: 302,
			},
		};
	}

	const prisma = new PrismaClient();

	const transaction = await prisma.transactionLog.findFirst({
		where: {
			id: transactionID,
			userId: session.user.id,
		},
	});

	if (!transaction) {
		return {
			redirect: {
				destination: "/?error=transaction-not-found",
				statusCode: 302,
			},
		};
	} else {
		return {
			props: { ...session.user, transaction },
		};
	}
};

type PageProps = {
	transaction: TransactionLog;
} & Session["user"];

const Edit: NextPage<PageProps> = ({ transaction }) => {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Duit Mana?</title>
				<meta name="description" content="Add new transaction" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="bg-radial from-primary to-secondary min-h-screen">
				<div className="animate-pulse bg-radial from-[#fff2002c] to-[#ffffff00] w-full h-screen absolute pointer-events-none" />
				<div className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
					<div className="w-full max-w-xs">
						<Link passHref href="/">
							<CustomButton variant="text" label="Cancel" startIcon={<FiX className="w-4 h-4" />} className="mb-4" />
						</Link>
						<EditForm
							className="border border-white"
							transaction={transaction}
							onSubmit={() => {
								router.push({
									pathname: "/",
									query: {
										success: "transaction-updated",
									},
								});
							}}
						/>
					</div>
				</div>
			</main>
		</>
	);
};

export default Edit;
