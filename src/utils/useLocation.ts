import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useLocation(latitude?: number, longitude?: number) {
	const { data: locationData } = useQuery({
		enabled: !!latitude && !!longitude,
		gcTime: 0,
		queryFn: () =>
			fetch(
				`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%20${longitude}&key=fc6f6d00ffcf4d0ba343e439c0c13cfe`,
			).then((res) => res.json()),
		queryKey: ["location"],
		refetchInterval: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		throwOnError: ({ message }) => {
			toast.error(message);
			return false;
		},
	});
	return locationData;
}
