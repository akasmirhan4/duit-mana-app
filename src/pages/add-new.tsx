import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button, TextInput } from "components/form";
import { Session } from "next-auth";
import { getAuthSession } from "server/common/get-server-session";
import { trpc } from "utils/trpc";
import { TransactionCategory } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { DayPicker } from "react-day-picker";
import { Dismissable } from "components";

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

			<main className="bg-radial from-[#320541] to-[#1B0536] min-h-screen">
				<div className="animate-pulse bg-radial from-[#fff2002c] to-[#ffffff00] w-full h-screen absolute pointer-events-none" />
				<div className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
					<div className="w-full max-w-xs">
						<Link passHref href="/">
							<Button variant="text" label="Back" startIcon={<FiArrowLeft className="w-4 h-4" />} className="mb-4" />
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

							{/* SHOW MORE */}

							{showMore && (
								<Dismissable className="relative" selected={showDateModal} onDismiss={() => setShowDateModal(false)}>
									<TextInput
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
											selected={date}
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
								<Button
									variant="outlined"
									label="Send"
									endIcon={<FiSend className="w-4 h-4" />}
									onClick={() => {
										toast.promise(
											addNewTransaction.mutateAsync({
												amount: amount || 0,
												category,
												description,
												date
											}),
											{
												loading: "Adding...",
												success: "Transaction added!",
												error: "Error adding transaction!",
											}
										);
									}}
									disabled={addNewTransaction.isLoading}
								/>
								<Button
									label={showMore ? "Simple" : "Details"}
									onClick={() => setShowMore(!showMore)}
									variant="text"
									endIcon={showMore ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
								/>
							</div>
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
