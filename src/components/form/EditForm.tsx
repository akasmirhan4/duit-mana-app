import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TransactionCategory, TransactionLog } from "@prisma/client";
import ConfirmCategoryModal from "components/modal/ConfirmCategoryModal";
import Modal from "components/modal/Modal";
import React, { FC, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiRotateCw, FiSend, FiTag } from "react-icons/fi";
import { trpc } from "utils/trpc";
import CustomButton from "./CustomButton";
import CustomTextInput from "./CustomTextInput";

export type EditFormProps = {
	transaction: TransactionLog | null;
	onSubmit?: (transaction: Partial<TransactionLog>) => void;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const EditForm: FC<EditFormProps> = ({ transaction, onSubmit, ...props }) => {
	const [category, setCategory] = useState<TransactionCategory | "">(transaction?.category ?? "");
	const [amount, setAmount] = useState<number | null>(transaction?.amount ?? null);
	const [description, setDescription] = useState(transaction?.description ?? "");
	const [date, setDate] = useState<Date | null>(transaction?.date ?? null);
	const [showMore, setShowMore] = useState(false);
	const [showDateModal, setShowDateModal] = useState(false);
	const [openConfirmCategoryModal, setOpenConfirmCategoryModal] = useState(false);

	const [parent] = useAutoAnimate<HTMLDivElement>();

	const getCategory = trpc.useMutation(["transaction.get-category"]);

	useEffect(() => {
		console.log(transaction);
		setCategory(transaction?.category ?? "");
		setAmount(transaction?.amount ?? null);
		setDescription(transaction?.description ?? "");
		setDate(transaction?.date ?? null);
		setShowMore(false);
		setShowDateModal(false);
	}, [transaction]);

	const updateTransaction = trpc.useMutation(["transaction.update"]);

	return (
		<div {...props} className={`${props.className} flex flex-col shadow-md rounded px-8 pt-6 pb-8 text-white`} ref={parent}>
			<ConfirmCategoryModal
				onSubmitCategory={(category) => {
					setCategory(category);
					setOpenConfirmCategoryModal(false);
				}}
				category={category}
				description={description}
				open={openConfirmCategoryModal}
			/>
			<CustomTextInput
				label="Amount (BND)"
				value={String(amount)}
				onChange={(e) => {
					const value = e.target.value;
					if (!value) {
						setAmount(null);
					} else {
						setAmount(Number(Number(value).toFixed(2)));
					}
				}}
				color="white"
				type="number"
				startAdornment="$"
				variant="outlined"
			/>
			<CustomTextInput value={description} onChange={(e) => setDescription(e.target.value)} label="Description" type="text" color="white" variant="outlined" />

			{/* SHOW MORE */}

			{showMore && (
				<div>
					<div className="hover:brightness-75 duration-200 ease-in-out">
						<label className={`block text-sm font-bold mb-2`}>Category</label>
						<select
							className={`cursor-pointer bg-transparent outline-none appearance-none w-full border text-white border-white text-sm px-4 py-2 rounded mb-4`}
							value={category ?? ""}
							onChange={(e) => setCategory(e.target.value as TransactionCategory)}
						>
							{/* TODO style the dropdown */}
							{["", ...Object.values(TransactionCategory)].map((category) => (
								<option key={category} value={category} className="capitalize text-black">
									{/* capitalize string */}
									{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
								</option>
							))}
						</select>
					</div>
					<CustomTextInput
						value={date?.toLocaleDateString()}
						onClick={() => setShowDateModal(!showDateModal)}
						readOnly
						label="Date"
						type="text"
						variant="outlined"
						className="cursor-pointer"
					/>
					<Modal open={showDateModal} onClose={() => setShowDateModal(false)}>
						<DayPicker
							className="bg-[#331536] border border-white text-white rounded px-6 pt-4 pb-8"
							mode="single"
							selected={date ?? new Date()}
							onSelect={(date) => {
								setShowDateModal(false);
								if (date) setDate(date);
							}}
							showOutsideDays
						/>
					</Modal>
				</div>
			)}
			<div className="flex justify-between">
				{!category ? (
					<CustomButton
						variant="outlined"
						label="Classify"
						endIcon={<FiTag className="w-4 h-4" />}
						className="mr-2"
						disabled={!description}
						onClick={() =>
							toast.promise(
								getCategory
									.mutateAsync({
										description,
									})
									.then((category) => {
										setOpenConfirmCategoryModal(true);
										setCategory(category ?? "");
									}),
								{
									loading: "Getting category...",
									success: "Category found!",
									error: (error) => `${error}`,
								}
							)
						}
					/>
				) : (
					<CustomButton
						variant="outlined"
						label="Send"
						endIcon={<FiSend className="w-4 h-4" />}
						className="mr-2"
						onClick={() =>
							transaction?.id &&
							toast.promise(
								updateTransaction
									.mutateAsync({
										id: transaction.id,
										amount: amount ?? 0,
										category,
										description,
										date: date ?? new Date(),
									})
									.then(() => {
										onSubmit &&
											onSubmit({
												id: transaction.id,
												amount: amount ?? 0,
												category,
												description,
												date: date ?? new Date(),
											});
										setAmount(null);
										setDescription("");
										setDate(new Date());
										setShowDateModal(false);
										setShowMore(false);
									}),
								{
									loading: "Updating...",
									success: "Transaction updated!",
									error: "Error updating transaction!",
								}
							)
						}
						color="red-200"
						disabled={updateTransaction.isLoading || !description || !amount || !category}
					/>
				)}
				<CustomButton
					label={showMore ? "Simple" : "Details"}
					onClick={() => setShowMore(!showMore)}
					variant="text"
					endIcon={showMore ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
					color="white"
				/>
			</div>
			{/* error message */}
			{updateTransaction.error && <div className="text-red-500 text-sm italic">{updateTransaction.error.message}</div>}
		</div>
	);
};

export default EditForm;
