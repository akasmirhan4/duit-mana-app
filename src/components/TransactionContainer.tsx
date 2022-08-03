import { TransactionLog } from "@prisma/client";
import React, { FC, useEffect, useState } from "react";
import { FiEdit, FiHeart, FiPlus, FiPlusSquare, FiShoppingBag, FiShoppingCart, FiTool, FiTrash } from "react-icons/fi";
import { IoAirplaneOutline, IoBugOutline, IoCarOutline, IoCashOutline, IoGameControllerOutline, IoRestaurantOutline } from "react-icons/io5";
import { AiOutlineSwap } from "react-icons/ai";
import { MdOutlineReceipt } from "react-icons/md";
import IconButton from "./IconButton";
import { trpc } from "utils/trpc";
import toast from "react-hot-toast";
import Dismissable from "./Dismissable";

type Props = {
	transaction: TransactionLog;
	refetch: () => void;
	onSelect?: () => void;
	selected?: boolean;
	onDismiss?: () => void;
};

const TransactionContainer: FC<Props> = ({ transaction, refetch, onSelect, selected, onDismiss }) => {
	let icon;

	const deleteTransaction = trpc.useMutation(["transaction.delete"]);

	switch (transaction.category) {
		case "RESTAURANTS":
			icon = <IoRestaurantOutline className="w-4 h-4" />;
			break;
		case "TRANSPORT":
			icon = <IoCarOutline className="w-4 h-4" />;
			break;
		case "SHOPPING":
			icon = <FiShoppingBag className="w-4 h-4" />;
			break;
		case "TRANSFERS":
			icon = <AiOutlineSwap className="w-4 h-4" />;
			break;
		case "ENTERTAINMENT":
			icon = <IoGameControllerOutline className="w-4 h-4" />;
			break;
		case "GROCERIES":
			icon = <FiShoppingCart className="w-4 h-4" />;
			break;
		case "SERVICES":
			icon = <FiTool className="w-4 h-4" />;
			break;
		case "GENERAL":
			icon = <MdOutlineReceipt className="w-4 h-4" />;
			break;
		case "OTHERS":
			icon = <MdOutlineReceipt className="w-4 h-4" />;
			break;
		case "CASH":
			icon = <IoCashOutline className="w-4 h-4" />;
			break;
		case "TRAVEL":
			icon = <IoAirplaneOutline className="w-4 h-4" />;
			break;
		case "HEALTH":
			icon = <FiHeart className="w-4 h-4" />;
			break;
		case "INCOME":
			icon = <FiPlus className="w-4 h-4" />;
			break;
		default:
			icon = <IoBugOutline className="w-4 h-4" />;
	}

	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex items-center w-full mb-2 relative">
				<Dismissable
					onSelect={onSelect}
					selected={selected}
					onDismiss={onDismiss}
					className={`border border-white text-white w-full rounded py-2 px-4 flex justify-between hover:bg-white hover:text-[#320541] ${
						selected && "bg-white text-[#320541]"
					} ease-in-out duration-100`}
				>
					<div className="flex items-center flex-1 truncate">
						{icon}
						<p className="mx-2 flex-1 truncate text-left">{transaction.description}</p>
					</div>
					<p>${transaction.amount}</p>
				</Dismissable>
			</div>
			<div className={`${selected ? "h-10" : "h-0"} items-center ease-in-out duration-200`}>
				<div
					className={`flex right-0 top-full rounded mb-2 ${
						selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
					} ease-in-out duration-100`}
				>
					<IconButton
						variant="text"
						className={`h-full ml-2`}
						onClick={() => {
							toast("Still making it. Hold on tight! 🤗");
						}}
					>
						<FiEdit className="w-4 h-4" />
					</IconButton>
					<IconButton
						variant="text"
						className={`h-full ml-2`}
						onClick={() => {
							toast.promise(
								deleteTransaction
									.mutateAsync({
										id: transaction.id,
									})
									.then(() => {
										refetch();
									}),
								{
									loading: "Deleting...",
									success: "Transaction deleted!",
									error: "Error deleting transaction!",
								}
							);
						}}
					>
						<FiTrash className="w-4 h-4" />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

export default TransactionContainer;
