import { useEffect } from "react";
import toast from "react-hot-toast";

export default function useToastError(error?: unknown) {
	return useEffect(() => {
		if (error) {
			toast.error((error as Error).message || "Terjadi kesalahan");
		}
	}, [error]);
}
