import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Portal: React.FC<PortalProps> = (props) => {
	const [root, setRoot] = useState<HTMLDivElement>();
	useEffect(() => {
		const root = document.querySelector("#portal-container");
		if (!root) {
			const newRoot = document.createElement("div");
			newRoot.id = "portal-container";
			newRoot.className = "relative";
			document.body.appendChild(newRoot);
			setRoot(newRoot);
		}
		setRoot(root as HTMLDivElement);
	}, []);

	return root ? ReactDOM.createPortal(props.children, root) : null;
};

export interface PortalProps {
	children: React.ReactNode;
}

export default Portal;
