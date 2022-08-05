import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TransactionCategory, TransactionLog } from "@prisma/client";
import Dismissable from "components/Dismissable";
import React, { FC, useState } from "react";
import { DayPicker } from "react-day-picker";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiSend, FiTag } from "react-icons/fi";
import { trpc } from "utils/trpc";
import CustomButton from "./CustomButton";
import CustomTextInput from "./CustomTextInput";

type Props = {
	onSubmit?: (transaction: Partial<TransactionLog>) => void;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const AddNewForm: FC<Props> = ({ onSubmit, ...props }) => {
	const [category, setCategory] = useState<TransactionCategory | "">("");
	const [amount, setAmount] = useState<number | null>();
	const [description, setDescription] = useState("");
	const [showDateModal, setShowDateModal] = useState(false);
	const [date, setDate] = useState<Date>(new Date());
	const [showMore, setShowMore] = useState(false);

	const addNewTransaction = trpc.useMutation(["transaction.add"]);
	const getCategory = trpc.useMutation(["transaction.get-category"]);

	const [parent] = useAutoAnimate<HTMLDivElement>();

	return (
		<div {...props} className={`${props.className} flex flex-col shadow-md rounded px-8 pt-6 pb-8 text-white`} ref={parent}>
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
					<Dismissable className="relative" selected={showDateModal} onDismiss={() => setShowDateModal(false)}>
						<CustomTextInput
							value={date?.toLocaleDateString()}
							onClick={() => {
								setShowDateModal(!showDateModal);
							}}
							readOnly
							label="Date"
							type="text"
							variant="outlined"
							className="cursor-pointer"
						/>
						<div
							className={`${
								showDateModal ? "visible" : "invisible"
							} flex justify-center items-center absolute mb-2 left-0 right-0 bottom-full duration-100 ease-in-out`}
						>
							<DayPicker
								className="bg-[#331536] border border-white text-white rounded px-6 pt-4 pb-8"
								mode="single"
								selected={date}
								onSelect={(date) => {
									setShowDateModal(false);
									if (date) setDate(date);
								}}
								showOutsideDays
							/>
						</div>
					</Dismissable>
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
							toast.promise(
								addNewTransaction
									.mutateAsync({
										amount: amount || 0,
										category,
										description,
										date,
									})
									.then(() => {
										onSubmit &&
											onSubmit({
												amount: amount || 0,
												category,
												description,
												date,
											});
										setAmount(null);
										setDescription("");
										setDate(new Date());
										setShowDateModal(false);
										setShowMore(false);
									}),
								{
									loading: "Adding...",
									success: "Transaction added!",
									error: "Error adding transaction!",
								}
							)
						}
						color="red-200"
						disabled={addNewTransaction.isLoading || !description || !amount || !category}
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
			{addNewTransaction.error && <div className="text-red-500 text-sm italic">{addNewTransaction.error.message}</div>}
		</div>
	);
};

export default AddNewForm;
