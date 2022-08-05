import { TransactionCategory } from "@prisma/client";
import { CustomButton, CustomTextInput } from "components/form";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckSquare } from "react-icons/fi";
import Modal, { ModalProps } from "./Modal";

type Props = {
	onSubmitCategory: (category: TransactionCategory) => void;
	category?: TransactionCategory | "";
	description?: string;
} & ModalProps;

const ConfirmCategoryModal: React.FC<Props> = ({ onSubmitCategory: onSubmit, open, onClose, category: initCategory, description }) => {
	const [category, setCategory] = React.useState<TransactionCategory | "">(initCategory ?? "");
	useEffect(() => {
		setCategory(initCategory ?? "");
	}, [initCategory]);

	return (
		<Modal open={open} onClose={onClose}>
			<div className={`flex flex-col shadow-md rounded px-8 pt-6 pb-8 text-white bg-secondary border border-white`}>
				<label className={`block text-sm font-bold mb-2`}>Category</label>
				<select
					className={`cursor-pointer bg-transparent outline-none appearance-none w-full border text-white border-white text-sm px-4 py-2 rounded mb-4`}
					value={category ?? ""}
					onChange={(e) => setCategory(e.target.value as TransactionCategory)}
				>
					{/* TODO style the dropdown */}
					{Object.values(TransactionCategory).map((category) => (
						<option key={category} value={category} className="capitalize text-black">
							{/* capitalize string */}
							{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
						</option>
					))}
				</select>
				<CustomTextInput value={description} label="Description" type="text" color="white" variant="outlined" readOnly />

				<div className="flex justify-between">
					<CustomButton
						variant="outlined"
						label="Confirm"
						endIcon={<FiCheckSquare className="w-4 h-4" />}
						className="mr-2"
						onClick={() => {
							if (!category) {
								toast.error("Please select a category");
								return;
							}
							onSubmit(category);
						}}
						color="red-200"
						disabled={!category}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default ConfirmCategoryModal;
