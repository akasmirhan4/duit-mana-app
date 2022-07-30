import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, Send } from "react-feather";
import { Button, TextInput } from "components/form";
import { Session } from "next-auth";
import { getAuthSession } from "server/common/get-server-session";
import { trpc } from "utils/trpc";
import { TransactionCategory } from "@prisma/client";
import { useEffect, useState } from "react";
import { string } from "zod";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getAuthSession(ctx);
	if (!session) {
		return {
			redirect: {
				destination: "/auth/login",
				statusCode: 302,
			},
		};
	}

	return {
		props: { ...session.user },
	};
};

const AddNew: NextPage<Session["user"]> = (props) => {
	const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.GENERAL);
	const [amount, setAmount] = useState<number | null>();
	const [description, setDescription] = useState("");

	const addNewTransaction = trpc.useMutation(["transaction.add"]);

	const router = useRouter();

	useEffect(() => {
		if (addNewTransaction.isSuccess) {
			router.push({
				pathname: "/",
				query: {
					success: true,
				},
			});
		}
	}, [addNewTransaction.isSuccess]);

	return (
		<>
			<Head>
				<title>Duit Mana?</title>
				<meta name="description" content="Add new transaction" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="bg-radial from-[#320541] to-[#1B0536] min-h-screen">
				<div className="animate-pulse bg-radial from-[#fff2002c] to-[#ffffff00] w-full h-screen absolute pointer-events-none" />
				<div className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
					<div className="w-full max-w-xs">
						<Link passHref href="/">
							<Button variant="text" label="Back" startIcon={<ArrowLeft className="w-4 h-4" />} className="mb-4" />
						</Link>
						<div className="border border-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
							<label className="block text-white text-sm font-bold mb-2">Category</label>
							<select
								className="bg-transparent outline-none appearance-none w-full border text-white border-white text-sm px-4 py-2 rounded mb-4"
								value={category}
								onChange={(e) => setCategory(e.target.value as TransactionCategory)}
							>
								{/* TODO style the dropdown */}
								{Object.values(TransactionCategory).map((category) => (
									<option key={category} value={category} className="capitalize text-black">
										{/* capitalize string */}
										{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
									</option>
								))}
							</select>
							<TextInput
								label="Amount (BND)"
								value={String(amount)}
								onChange={(e) => {
									const value = e.target.value;
									if (!value) {
										setAmount(null);
									} else {
										setAmount(Number(Number(value).toFixed(2)));
									}
								}}
								type="number"
								startAdornment="$"
								variant="outlined"
							/>
							<TextInput value={description} onChange={(e) => setDescription(e.target.value)} label="Description" type="text" variant="outlined" />
							<Button
								variant="outlined"
								label="Send"
								endIcon={<Send className="w-4 h-4" />}
								onClick={() =>
									addNewTransaction.mutate({
										amount: amount || 0,
										category,
										description,
									})
								}
								disabled={addNewTransaction.isLoading}
							/>
							{/* error message */}
							{addNewTransaction.error && <div className="text-red-500 text-sm italic">{addNewTransaction.error.message}</div>}
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default AddNew;
