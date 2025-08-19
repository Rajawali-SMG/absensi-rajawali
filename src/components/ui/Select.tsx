import type { DetailedHTMLProps, SelectHTMLAttributes } from "react";

interface SelectOption {
	value: string | number;
	label?: string;
	isDone?: boolean;
}

type SelectProps = DetailedHTMLProps<
	SelectHTMLAttributes<HTMLSelectElement>,
	HTMLSelectElement
> & {
	name: string;
	label?: string;
	options: SelectOption[];
	placeHolderEnabled?: boolean;
	placeholder: string;
};

export default function Select({
	name,
	label,
	options,
	placeHolderEnabled,
	placeholder,
	...props
}: SelectProps) {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-700" htmlFor={name}>
				{label}
			</label>

			<select
				id={name}
				name={name}
				{...props}
				className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option disabled={!placeHolderEnabled} value="">
					{placeholder}
				</option>
				{options.map((option) => (
					<option
						disabled={option.isDone}
						key={option.value}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
