import React, { FC } from "react";
type Props = {} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const ScrollableContainer: FC<Props> = ({ children, ...props }) => {

	return (
		<div {...props} className={`${props.className} overflow-y-scroll custom-scrollbar rounded pr-2`}>
			{children}
		</div>
	);
};

export default ScrollableContainer;
