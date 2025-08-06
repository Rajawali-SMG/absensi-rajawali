import { useQuery } from "@tanstack/react-query";

export default function useLocation(latitude?: number, longitude?: number) {
	const { data: locationData } = useQuery({
		queryKey: ["location"],
		queryFn: () =>
			fetch(
				`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%20${longitude}&key=fc6f6d00ffcf4d0ba343e439c0c13cfe`,
			).then((res) => res.json()),
		refetchOnWindowFocus: false,
		gcTime: 0,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchOnMount: false,
		enabled: !!latitude && !!longitude,
	});
	return locationData;
}
