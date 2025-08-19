import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import cn from "@/utils/cn";

type ButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	variant?: "primary" | "secondary";
};

const buttonVariants = cva(
	"font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:ring-4 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
	{
		defaultVariants: {
			variant: "primary",
		},
		variants: {
			variant: {
				primary:
					" bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 text-white",
				secondary:
					" bg-white hover:bg-gray-100 focus:ring-gray-200 text-gray-900 border border-gray-300",
			},
		},
	},
);

export default function Button({ className, variant, ...props }: ButtonProps) {
	return (
		<button className={cn(buttonVariants({ className, variant }))} {...props} />
	);
}
