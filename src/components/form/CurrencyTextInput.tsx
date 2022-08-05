import React, { FC } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";

type Props = {
	color?: string;
	label?: string;
	error?: string;
	variant?: "contained" | "outlined";
} & NumberFormatProps;

const CurrencyTextInput: FC<Props> = ({ label, error, variant = "contained", color, ...props }) => {
	let variantStyle = "";

	switch (variant) {
		case "outlined":
			variantStyle = `bg-transparent border border-${color ?? "white"} text-${color ?? "white"}`;
			break;
		case "contained":
		default:
			variantStyle = `bg-${color ?? "white"} text-${color ?? "primary"}`;
			break;
	}

	return (
		<div className={`mb-4 ${props.readOnly && "cursor-pointer"} hover:brightness-75 duration-200 ease-in-out`}>
			<label className={`block text-[${color ?? "#FFFFFF"}] text-sm font-bold mb-2`}>{label || "Empty label 🤷‍♂️"}</label>
			<NumberFormat
				{...props}
				thousandSeparator=","
				prefix="$"
				inputMode="decimal"
				decimalScale={2}
				className={`${props.className} shadow appearance-none rounded w-full pl-3
				py-2 pr-3 leading-tight focus:outline-none focus:shadow-outline text-sm ${variantStyle} ${!!error && "border-red-500"}`}
				placeholder="$0.00"
			/>
			{!!error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
		</div>
	);
};

export default CurrencyTextInput;
