import React, { FC, useEffect, useState } from "react";

type Props = {
	children: React.ReactNode;
	onSelect?: () => void;
	onDismiss?: () => void;
	selected?: boolean;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Dismissable: FC<Props> = ({ children, onSelect, onDismiss, selected, ...props }) => {
	const transactionRef = React.useRef<HTMLButtonElement>(null);
	const [clickedOutside, setClickedOutside] = React.useState(false);

	const handleOutsideClick = (e: MouseEvent) => {
		if (transactionRef.current) {
			setClickedOutside(!transactionRef.current.contains(e.target as Node));
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	useEffect(() => {
		if (selected && clickedOutside) {
			onDismiss && onDismiss();
		}
	}, [clickedOutside]);

	return (
		<button ref={transactionRef} onClick={onSelect} {...props}>
			{children}
		</button>
	);
};

export default Dismissable;
