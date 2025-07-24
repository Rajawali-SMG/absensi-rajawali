import type { AnyFieldApi } from "@tanstack/react-form";

export default function TextError({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<em className="text-red-500 text-sm">
					{field.state.meta.errors.map((err) => err.message).join(",")}
				</em>
			) : null}
			{field.state.meta.isValidating && "Validating"}
		</>
	);
}
