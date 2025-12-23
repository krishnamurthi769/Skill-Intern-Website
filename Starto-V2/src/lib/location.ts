
/**
 * Calculates the Haversine distance between two points in kilometers.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export type DistanceBucket = 'VERY_NEAR' | 'NEAR' | 'REACHABLE' | 'FAR';

/**
 * Categorizes distance into priority buckets.
 * @param distanceKm Distance in kilometers
 * @returns Bucket label
 */
export function getDistanceBucket(distanceKm: number): DistanceBucket {
    if (distanceKm < 5) return 'VERY_NEAR';
    if (distanceKm < 10) return 'NEAR';
    if (distanceKm < 50) return 'REACHABLE';
    return 'FAR';
}

/**
 * Returns a score component based on distance.
 * Lower distance = Higher score.
 * Max score 50 for < 2km.
 */
export function getDistanceScore(distanceKm: number): number {
    // 0-2km: 50 points
    if (distanceKm <= 2) return 50;
    // 2-10km: 40 points
    if (distanceKm <= 10) return 40;
    // 10-25km: 30 points
    if (distanceKm <= 25) return 30;
    // 25-50km: 15 points
    if (distanceKm <= 50) return 15;
    // >50km: 0 points
    return 0;
}
