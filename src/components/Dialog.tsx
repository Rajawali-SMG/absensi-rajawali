import Button from "@/components/ui/Button";

export default function Dialog({
	title,
	description,
	handleCancel,
	handleConfirm,
	cancel,
	confirm,
}: {
	title: string;
	description: string;
	handleCancel: () => void;
	cancel: string;
	handleConfirm: () => void;
	confirm: string;
}) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300">
			<div className="bg-white w-1/4 mx-auto my-20 p-4 space-y-2 rounded-lg">
				<h1 className="font-bold text-gray-800">{title}</h1>
				<p className="text-gray-800">{description}</p>
				<div className="flex justify-end">
					<Button onClick={handleCancel}>{cancel}</Button>
					<Button onClick={handleConfirm} type="button">
						{confirm}
					</Button>
				</div>
			</div>
		</div>
	);
}
