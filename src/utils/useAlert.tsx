"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface AlertContextType {
	message: string;
	type: "success" | "error" | "";
	setAlert: (message: string, type: "success" | "error" | "") => void;
}

const initialState: AlertContextType = {
	message: "",
	type: "",
	setAlert: () => {},
};

export const AlertContext = createContext<AlertContextType>(initialState);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
	const [message, setMessage] = useState("");
	const [type, setType] = useState<"success" | "error" | "">("");

	const setAlert = (
		alertMessage: string,
		alertType: "success" | "error" | "",
	) => {
		setMessage(alertMessage);
		setType(alertType);

		setTimeout(() => {
			setMessage("");
			setType("");
		}, 5000);
	};

	return (
		<AlertContext.Provider value={{ message, type, setAlert }}>
			{children}
		</AlertContext.Provider>
	);
};

export const useAlert = () => useContext(AlertContext);
