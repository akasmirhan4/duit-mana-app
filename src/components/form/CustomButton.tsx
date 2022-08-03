import React, { FC } from "react";

type Props = {
	label?: string;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	color?: string;
	variant?: "contained" | "outlined" | "text";
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const CustomButton: FC<Props> = ({ startIcon, endIcon, label, color = "white", variant = "contained", ...props }) => {
	//TODO: startIcon endIcon set starting size of icon
	let variantStyle = "";
	switch (variant) {
		case "outlined":
			variantStyle = `bg-transparent border border-white text-white hover:bg-white hover:text-primary`;
			break;
		case "text":
			variantStyle = `border border-transparent bg-transparent text-white hover:border-white`;
			break;
		case "contained":
		default:
			variantStyle = `border border-transparent bg-white text-primary hover:bg-transparent hover:text-white hover:border-white`;
	}
	return (
		<button
			{...props}
			className={`${variantStyle} font-bold py-2 px-4 rounded inline-flex items-center ease-in-out duration-100 text-sm
			${props.className}`}
		>
			{startIcon && <span className="mr-2">{startIcon}</span>}
			<span>{label ?? "No label 😢"}</span>
			{endIcon && <span className="ml-2">{endIcon}</span>}
		</button>
	);
};

export default CustomButton;
