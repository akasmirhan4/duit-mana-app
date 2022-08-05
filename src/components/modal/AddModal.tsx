import { TransactionLog } from "@prisma/client";
import AddNewForm, { AddNewFormProps } from "components/form/AddNewForm";
import React from "react";
import Modal, { ModalProps } from "./Modal";

type Props = AddNewFormProps & ModalProps;

const AddModal: React.FC<Props> = ({ onSubmit, open, onClose }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<AddNewForm
				className="bg-secondary bg-opacity-75 border-white border shadow-md"
				onSubmit={onSubmit}
			/>
		</Modal>
	);
};

export default AddModal;
