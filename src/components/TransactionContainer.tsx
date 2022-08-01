import { TransactionLog } from "@prisma/client";
import React, { FC } from "react";
import { FiHeart, FiPlusSquare, FiShoppingBag, FiShoppingCart, FiTool } from "react-icons/fi";
import { IoAirplaneOutline, IoBugOutline, IoCarOutline, IoCashOutline, IoGameControllerOutline, IoRestaurantOutline } from "react-icons/io5";
import { AiOutlineSwap } from "react-icons/ai";
import { MdOutlineReceipt } from "react-icons/md";

type Props = {
	transaction: TransactionLog;
};

const TransactionContainer: FC<Props> = ({ transaction }) => {
	let icon;

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
			icon = <FiPlusSquare className="w-4 h-4" />;
			break;
		default:
			icon = <IoBugOutline className="w-4 h-4" />;
	}

	return (
		<div className="border border-white text-white w-full mb-2 rounded py-2 px-4 flex justify-between">
			<div className="flex items-center">
				{icon}
				<p className="ml-2">{transaction.description}</p>
			</div>
			<p>${transaction.amount}</p>
		</div>
	);
};

export default TransactionContainer;
