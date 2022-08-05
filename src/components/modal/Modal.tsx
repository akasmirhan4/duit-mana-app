import Portal from "components/Portal";
import React, { FC, useEffect, useState } from "react";

export type ModalProps = {
	open?: boolean;
	onClose?: () => void;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Modal: FC<ModalProps> = ({ children, open, onClose, containerProps, ...props }) => {
	const escFunction = (ev: KeyboardEvent) => {
		if (ev.key === "Escape") {
			open && onClose && onClose();
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", escFunction, false);

		return () => {
			document.removeEventListener("keydown", escFunction, false);
		};
	}, []);

	return (
		<Portal>
			<div
				{...containerProps}
				className={`${
					open ? "visible opacity-100" : "invisible opacity-0"
				} absolute z-50 bg-black bg-opacity-90 flex items-center justify-center w-screen h-screen duration-200 ease-in-out left-0 top-0`}
				onClick={() => {
					onClose && onClose();
				}}
			>
				<div {...props} className={`${props.className}`} onClick={(e) => e.stopPropagation()}>
					{children}
				</div>
			</div>
		</Portal>
	);
};

export default Modal;
