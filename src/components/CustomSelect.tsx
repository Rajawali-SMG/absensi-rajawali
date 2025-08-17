import Select, { type GroupBase, type Props } from "react-select";

interface CustomSelectProps<
	Option,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends Props<Option, IsMulti, Group> {
	label: string;
}

export default function CustomSelect<
	Option,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>,
>({ label, ...props }: CustomSelectProps<Option, IsMulti, Group>) {
	return (
		<div className="flex flex-col space-y-1">
			<label htmlFor={label} className="text-sm font-medium text-gray-700">
				{label}
			</label>
			<Select {...props} isClearable />
		</div>
	);
}
