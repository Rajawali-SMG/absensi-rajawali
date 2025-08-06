// Function to calculate distance between two points in kilometers using Haversine formula
export function calculateDistance(
	latBase: number,
	lonBase: number,
	latTarget: number,
	lonTarget: number,
): number {
	const R = 6371; // Radius of the earth in km
	const dLat = (latTarget - latBase) * (Math.PI / 180);
	const dLon = (lonTarget - lonBase) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(latBase * (Math.PI / 180)) *
			Math.cos(latTarget * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c; // Distance in km
	return distance;
}
