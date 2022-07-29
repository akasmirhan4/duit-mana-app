import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, Zap } from "react-feather";
import { Button } from "components/form";
import { getAuthSession } from "server/common/get-server-session";

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
		props: {
			session,
		},
	};
};

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Home | Duit Mana?</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/images/icon.png" />
			</Head>

			<main className="bg-radial from-[#320541] to-[#1B0536] min-h-screen">
				<div className="animate-pulse bg-radial from-[#fff2002c] to-[#ffffff00] w-full h-screen absolute pointer-events-none" />
				<div className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
					<div className="flex-1 flex flex-col justify-center items-center">
						<div className="animate-pulse">
							<Image src="/images/question-mark.png" alt="Duit Mana?" width={200} height={200} />
						</div>
						<h1 className="text-2xl font-semibold text-white text-center pb-4 pt-2">Duit Mana?</h1>
						<Link href="/add-new" passHref>
							<Button variant="outlined" startIcon={<PlusCircle className="w-4 h-4" />} label="Add Transaction" />
						</Link>
					</div>
					<h3 className="text-[#E6BBFF] text-center mt-1">Designed by akasmirhan4</h3>
				</div>
			</main>
		</>
	);
};

export default Home;
