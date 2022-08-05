import { TransactionLog } from "@prisma/client";
import EditForm, { EditFormProps } from "components/form/EditForm";
import React from "react";
import Modal, { ModalProps } from "./Modal";

type Props = EditFormProps & ModalProps;

const EditModal: React.FC<Props> = ({ onSubmit, transaction, open, onClose }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<EditForm
				className="bg-secondary bg-opacity-75 border-white border shadow-md"
				onSubmit={onSubmit}
				transaction={transaction}
			/>
		</Modal>
	);
};

export default EditModal;
