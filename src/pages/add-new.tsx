import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { CustomButton } from "components/form";
import { Session } from "next-auth";
import { getAuthSession } from "server/common/get-server-session";
import { trpc } from "utils/trpc";
import { TransactionCategory } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import AddNewForm from "components/form/AddNewForm";

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
	const [showDateModal, setShowDateModal] = useState(false);
	const [date, setDate] = useState<Date>(new Date());
	const [showMore, setShowMore] = useState(false);

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

			<main className="bg-radial from-primary to-secondary min-h-screen">
				<div className="animate-pulse bg-radial from-[#fff2002c] to-[#ffffff00] w-full h-screen absolute pointer-events-none" />
				<div className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
					<div className="w-full max-w-xs">
						<Link passHref href="/">
							<CustomButton variant="text" label="Back" startIcon={<FiArrowLeft className="w-4 h-4" />} className="mb-4" />
						</Link>
						<AddNewForm
							className="border border-white"
							onSubmit={() => {
								router.push({
									pathname: "/",
									query: {
										success: "transaction-added",
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

export default AddNew;
