import Dismissable from "components/Dismissable";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FiLogOut, FiPieChart, FiSettings, FiUser } from "react-icons/fi";
import autoAnimate from "@formkit/auto-animate";
import Modal from "./modal/Modal";

function Navbar() {
	const { data, status } = useSession();
	const [expandMenu, setExpandMenu] = useState(false);
	const user = data && data.user;
	const parent = useRef<HTMLDivElement>(null);

	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, [parent]);

	type MenuItem = {
		label: string;
		icon: React.ReactNode;
		href?: string;
		onClick?: () => void;
	};
	const menuItems: MenuItem[] = [
		{
			label: "Dashboard",
			icon: <FiPieChart className="w-4 h-4" />,
			href: "/",
		},
		{
			label: "Settings",
			icon: <FiSettings className="w-4 h-4" />,
			href: "/settings",
		},
		{
			label: "Sign out",
			icon: <FiLogOut className="w-4 h-4" />,
			onClick: signOut,
		},
	];

	return (
		<nav className="bg-transparent absolute w-screen">
			<div className="md:container mx-auto px-6 py-4">
				<div className="flex items-center justify-end">
					<div className="flex flex-col flex-end w-full">
						<div className="self-end relative" ref={parent}>
							<button onClick={() => setExpandMenu(!expandMenu)} className="rounded-full overflow-hidden flex hover:brightness-90">
								{user?.image ? (
									<Image src={user.image} width={32} height={32} alt="User Profile Image" />
								) : (
									<div
										className={`${
											status === "loading" ? "animate-pulse" : ""
										} border border-white p-2 rounded-full text-white hover:bg-white hover:text-secondary`}
									>
										<FiUser className="w-4 h-4" />
									</div>
								)}
							</button>
							<Modal className="hover:brightness-150" onClose={() => setExpandMenu(false)} open={expandMenu}>
								<div className={`border border-white rounded dropdown-menu dropdown-menu-right`}>
									<div className="py-3 px-4">
										<span className="block text-sm text-gray-900 dark:text-white">{user?.name}</span>
										<span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">{user?.email}</span>
									</div>
									<ul className="py-2">
										{menuItems.map((item, index) => {
											if (item.href) {
												return (
													<li key={index}>
														<Link href={item.href} passHref>
															<a className="flex items-center cursor-pointer py-2 px-4 text-sm text-white hover:bg-white dark:hover:text-secondary">
																{item.icon}
																<p className="ml-2">{item.label}</p>
															</a>
														</Link>
													</li>
												);
											}
											return (
												<li key={index} onClick={item.onClick}>
													<div className="flex items-center cursor-pointer py-2 px-4 text-sm text-white hover:bg-white dark:hover:text-secondary duration-100 ease-in-out">
														{item.icon}
														<p className="ml-2">{item.label}</p>
													</div>
												</li>
											);
										})}
									</ul>
								</div>
							</Modal>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
