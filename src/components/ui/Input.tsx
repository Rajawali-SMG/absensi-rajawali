import { Icon } from "@iconify/react";
import {
	type DetailedHTMLProps,
	type InputHTMLAttributes,
	type ReactNode,
	useState,
} from "react";

type InputVariant = "primary" | "secondary";

type InputProps = DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	variant?: InputVariant;
	label: ReactNode;
	htmlFor: string | undefined;
};

export default function Input({
	variant = "primary",
	label,
	type,
	className,
	htmlFor,
	...props
}: InputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const getVariantClasses = (variant: InputVariant) => {
		const variants = {
			primary:
				"bg-gray-50 border-gray-300 text-gray-900 focus-within:ring-primary-500 focus-within:border-primary-500",
			secondary:
				"bg-white border-gray-200 text-gray-800 focus-within:ring-secondary-500 focus-within:border-secondary-500",
		};

		return variants[variant];
	};

	const getLabelClasses = (variant: InputVariant) => {
		const variants = {
			primary: "text-gray-900",
			secondary: "text-gray-800",
		};

		return variants[variant];
	};

	const getIconColor = (variant: InputVariant) => {
		const colors = {
			primary: "currentColor",
			secondary: variant === "primary" ? "white" : "currentColor",
		};

		return colors[variant];
	};

	return (
		<>
			<label
				htmlFor={htmlFor}
				className={`block mb-2 text-sm font-medium ${getLabelClasses(variant)}`}
			>
				{label}
			</label>
			<div
				className={`flex space-x-2 border sm:text-sm rounded-lg w-full p-2.5 ring-offset-2 focus-within:ring-2 transition-colors ${getVariantClasses(variant)} ${className}`}
			>
				<input
					type={type === "password" && showPassword ? "text" : type}
					className="focus:outline-none w-full bg-transparent"
					{...props}
				/>
				{type === "password" && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md p-1"
					>
						<Icon
							icon={showPassword ? "mdi:eye" : "mdi:eye-off"}
							color={getIconColor(variant)}
							width={20}
						/>
					</button>
				)}
			</div>
		</>
	);
}
