import React, { FC, useEffect, useState } from "react";

type Props = {
	open?: boolean;
	onClose?: () => void;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Modal: FC<Props> = ({ children, open, onClose, containerProps, ...props }) => {
	return (
		<div
			{...containerProps}
			className={`${open ? "visible opacity-100" : "invisible opacity-0"} absolute z-50 bg-black bg-opacity-90 flex items-center justify-center w-screen h-screen duration-200 ease-in-out`}
			onClick={() => {
				onClose && onClose();
			}}
		>
			<div {...props} className={`${props.className}`} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
};

export default Modal;
