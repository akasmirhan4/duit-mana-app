import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, Send, Zap } from "react-feather";
import { Button, TextInput } from "../components/form";

const AddNew: NextPage = () => {
	return (
		<>
			<Head>
				<title>Duit Mana?</title>
				<meta name="description" content="Add new transaction" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="bg-radial from-[#320541] to-[#1B0536] h-screen">
				<div className="animate-pulse bg-radial from-[#fff2002c] to-[#ffffff00] w-full h-full absolute pointer-events-none" />
				<div className="container mx-auto flex flex-col items-center justify-center h-full p-4">
					<div className="w-full max-w-xs">
						<Link passHref href="/">
							<Button variant="text" label="Back" startIcon={<ArrowLeft className="w-4 h-4" />} className="mb-4" />
						</Link>
						<form className="border border-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
							<TextInput label="Amount (BND)" type="number" startAdornment="$" variant="outlined" />
							<TextInput label="Description" type="text" variant="outlined" />
							<Button variant="outlined" type="submit" label="Send" endIcon={<Send className="w-4 h-4" />} />
						</form>
					</div>
				</div>
			</main>
		</>
	);
};

export default AddNew;
