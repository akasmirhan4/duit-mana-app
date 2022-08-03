import React, { FC } from "react";

type Props = {
	color?: string;
	label?: string;
	error?: string;
	variant?: "contained" | "outlined";
	startAdornment?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const CustomTextInput: FC<Props> = ({ label, error, startAdornment, variant = "contained", color, ...props }) => {
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
		<div className="mb-4">
			<label className={`block text-[${color ?? "#FFFFFF"}] text-sm font-bold mb-2`} htmlFor={label}>
				{label || "Empty label 🤷‍♂️"}
			</label>
			<div className="relative">
				<div
					className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm leading-tight ${variantStyle} border-none bg-transparent`}
				>
					<p>{startAdornment}</p>
				</div>
				<input
					{...props}
					className={`${props.className} shadow appearance-none rounded w-full ${
						!!startAdornment ? "pl-6" : "pl-3"
					} py-2 pr-3 leading-tight focus:outline-none focus:shadow-outline text-sm ${variantStyle} ${!!error && "border-red-500"}`}
					id={label}
				/>
			</div>
			{!!error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
		</div>
	);
};

export default CustomTextInput;
