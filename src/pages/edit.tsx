import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { CustomButton, CustomTextInput } from "components/form";
import { Session } from "next-auth";
import { getAuthSession } from "server/common/get-server-session";
import { trpc } from "utils/trpc";
import { PrismaClient, TransactionCategory, TransactionLog } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiRefreshCw, FiSend, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { DayPicker } from "react-day-picker";
import { Dismissable } from "components";

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
	transaction?: TransactionLog;
} & Session["user"];

const Edit: NextPage<PageProps> = ({ transaction }) => {
	const [category, setCategory] = useState<TransactionCategory>(transaction?.category ?? TransactionCategory.GENERAL);
	const [amount, setAmount] = useState<number | null>(transaction?.amount ?? null);
	const [description, setDescription] = useState(transaction?.description ?? "");
	const [date, setDate] = useState<Date | null>(transaction?.date ?? null);
	const [showMore, setShowMore] = useState(false);
	const [showDateModal, setShowDateModal] = useState(false);

	const updateTransaction = trpc.useMutation(["transaction.update"]);

	const router = useRouter();

	useEffect(() => {
		if (updateTransaction.isSuccess) {
			router.push({
				pathname: "/",
				query: {
					success: "transaction-updated",
				},
			});
		}
	}, [updateTransaction.isSuccess]);

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
						<div className="flex flex-col border border-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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

							<CustomTextInput
								label="Amount (BND)"
								id="edit-amount"
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
							<CustomTextInput
								id="edit-description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								label="Description"
								type="text"
								variant="outlined"
							/>

							{/* SHOW MORE */}

							{showMore && (
								<Dismissable className="relative" selected={showDateModal} onDismiss={() => setShowDateModal(false)}>
									<CustomTextInput
										id="edit-date"
										value={date?.toLocaleDateString()}
										onClick={() => {
											setShowDateModal(true);
										}}
										readOnly
										label="Date"
										type="text"
										variant="outlined"
										className="cursor-pointer"
									/>
									<div
										className={`${
											showDateModal ? "visible" : "invisible"
										} flex justify-center items-center absolute mb-2 left-0 right-0 bottom-full duration-100 ease-in-out`}
									>
										<DayPicker
											className="bg-[#331536] border border-white text-white rounded px-6 pt-4 pb-8"
											mode="single"
											selected={date ?? new Date()}
											onSelect={(date) => {
												setShowDateModal(false);
												if (date) setDate(date);
											}}
											showOutsideDays
										/>
									</div>
								</Dismissable>
							)}
							<div className="flex justify-between">
								<CustomButton
									variant="outlined"
									label="Update"
									endIcon={<FiRefreshCw className="w-4 h-4" />}
									className="mr-2"
									onClick={() => {
										transaction?.id &&
											toast.promise(
												updateTransaction.mutateAsync({
													id: transaction.id,
													amount: amount ?? 0,
													category,
													description,
													date: date ?? new Date(),
												}),
												{
													loading: "Updating...",
													success: "Transaction updated!",
													error: "Error updating transaction!",
												}
											);
									}}
									disabled={updateTransaction.isLoading}
								/>
								<CustomButton
									label={showMore ? "Simple" : "Details"}
									onClick={() => setShowMore(!showMore)}
									variant="text"
									endIcon={showMore ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
								/>
							</div>
							{/* error message */}
							{updateTransaction.error && <div className="text-red-500 text-sm italic">{updateTransaction.error.message}</div>}
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Edit;
