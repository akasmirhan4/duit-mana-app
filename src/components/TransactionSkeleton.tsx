import React, { FC } from "react";

type Props = {};

const TransactionSkeleton: FC<Props> = () => {
	return <div className="text-white w-full mb-2 rounded py-5 px-4 flex justify-between animate-pulse bg-[#FFFFFF50]" />;
};

export default TransactionSkeleton;
