import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { FiLogOut, FiPieChart, FiSettings, FiUser } from "react-icons/fi";

function Navbar() {
	const { data, status } = useSession();
	const user = data && data.user;

	const menuRef = React.useRef<HTMLDivElement>(null);

	const [expandMenu, setExpandMenu] = React.useState(false);
	const [clickedOutside, setClickedOutside] = React.useState(false);

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

	const handleOutsideClick = (e: MouseEvent) => {
		if (menuRef.current) {
			setClickedOutside(!menuRef.current.contains(e.target as Node));
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	useEffect(() => {
		if (expandMenu && clickedOutside) {
			setExpandMenu(false);
		}
	}, [clickedOutside]);

	return (
		<nav className="bg-transparent absolute w-screen">
			<div className="md:container mx-auto px-6 py-4">
				<div className="flex items-center justify-end">
					<div className="flex flex-col flex-end w-full">
						<div className="self-end relative" ref={menuRef}>
							<button
								className="hover:scale-105 duration-200 ease-in-out"
								onClick={() => {
									setExpandMenu(!expandMenu);
									setClickedOutside(false);
								}}
							>
								{user?.image ? (
									<Image src={user.image} width={32} height={32} className="rounded-full" />
								) : (
									<div className={`${status === "loading" ? "animate-pulse" : ""} border border-white p-2 rounded-full text-white hover:bg-white hover:text-[#1B0536]`}>
										<FiUser className="w-4 h-4" />
									</div>
								)}
							</button>
							<div className={`self-end absolute right-0 mt-2 border border-white rounded dropdown-menu dropdown-menu-right ${expandMenu ? "show" : "hidden"}`}>
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
														<div className="flex items-center cursor-pointer py-2 px-4 text-sm text-white hover:bg-white dark:hover:text-[#1B0536] duration-100 ease-in-out">
															{item.icon}
															<a className="ml-2">{item.label}</a>
														</div>
													</Link>
												</li>
											);
										}
										return (
											<li key={index} onClick={item.onClick}>
												<div className="flex items-center cursor-pointer py-2 px-4 text-sm text-white hover:bg-white dark:hover:text-[#1B0536] duration-100 ease-in-out">
													{item.icon}
													<a className="ml-2">{item.label}</a>
												</div>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
