import React, { FC, useEffect, useState } from "react";

type Props = {
	children: React.ReactNode;
	onSelect?: () => void;
	onDismiss?: () => void;
	selected?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Dismissable: FC<Props> = ({ children, onSelect, onDismiss, selected, ...props }) => {
	const dismissableRef = React.useRef<HTMLDivElement>(null);
	const [clickedOutside, setClickedOutside] = React.useState(false);

	const handleOutsideClick = (e: MouseEvent) => {
		if (dismissableRef.current) {
			setClickedOutside(!dismissableRef.current.contains(e.target as Node));
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
		<div
			{...props}
			ref={dismissableRef}
			className={`${props.className} cursor-pointer`}
			onClick={() => {
				onSelect && onSelect();
			}}
		>
			{children}
		</div>
	);
};

export default Dismissable;
