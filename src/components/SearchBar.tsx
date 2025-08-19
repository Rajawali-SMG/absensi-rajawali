import { usePathname, useSearchParams } from "next/navigation";
import {
	type ChangeEvent,
	type DetailedHTMLProps,
	type InputHTMLAttributes,
	useEffect,
	useState,
} from "react";
import { useDebounce } from "use-debounce";
import cn from "@/utils/cn";

type SearchBarProps = DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	className?: string;
	onSearchChange?: (value: string) => void;
};

export default function SearchBar({
	className,
	onSearchChange,
	...props
}: SearchBarProps) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
	const [debouncedSearch] = useDebounce(searchInput, 1000);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchInput(value);
	};

	useEffect(() => {
		const params = new URLSearchParams(searchParams);

		if (debouncedSearch) {
			params.set("q", debouncedSearch);
		} else {
			params.delete("q");
		}

		history.replaceState(null, "", `${pathname}?${params.toString()}`);

		if (onSearchChange) {
			onSearchChange(debouncedSearch);
		}
	}, [debouncedSearch, pathname, searchParams]);

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<input
				className={cn(
					"w-full rounded-md border border-gray-300 p-2",
					"focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none",
					"transition duration-200",
					className,
				)}
				onChange={handleChange}
				type="text"
				value={searchInput}
				{...props}
			/>
		</div>
	);
}
