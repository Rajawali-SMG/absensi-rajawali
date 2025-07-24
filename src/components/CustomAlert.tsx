"use client";

import { useAlert } from "@/utils/useAlert";

export function CustomAlert() {
	const { message, type } = useAlert();

	if (message !== "" && type === "error") {
		return (
			<div
				className={`px-4 rounded-md border-l-4 border-red-500 bg-red-50 md:max-w-2xl md:px-8 z-50 fixed left-1/2 transform -translate-x-1/2 mt-4 ${type === "error" ? "show" : "hide"}`}
			>
				<div className="flex justify-between py-3">
					<div className="flex">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-red-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<title>Error</title>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="self-center ml-3">
							<span className="text-red-600 font-semibold">Error</span>
							<p className="text-red-600 mt-1">{message}</p>
						</div>
					</div>
					<button type="button" className="self-start text-red-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<title>Close</title>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		);
	} else if (message !== "" && type === "success") {
		return (
			<div
				className={`px-4 rounded-md border-l-4 border-green-500 bg-green-50 md:max-w-2xl md:px-8 z-50 fixed left-1/2 transform -translate-x-1/2 mt-4 ${type === "success" ? "show" : "hide"}`}
			>
				<div className="flex justify-between py-3">
					<div className="flex">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 rounded-full text-green-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<title>Success</title>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="self-center ml-3">
							<span className="text-green-600 font-semibold">Success</span>
							<p className="text-green-600 mt-1">{message}</p>
						</div>
					</div>
					<button type="button" className="self-start text-green-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<title>Close</title>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
}
