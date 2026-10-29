import { brand } from '../config/brand';

// Region comes from the public brand configuration; it is never an atelier address.
export function homeMapLocation() {
    const confirmed = locationLinks(brand.address);
    const query = encodeURIComponent(brand.city);
    return {
        confirmed,
        embed: confirmed?.embed ?? `https://maps.google.com/maps?q=${query}&z=12&output=embed`,
        external: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(confirmed?.address ?? brand.city)}`,
    };
}

export function locationLinks(address: string | null) {
    const confirmedAddress = address?.trim();
    if (!confirmedAddress) return null;
    const destination = encodeURIComponent(confirmedAddress);
    return {
        address: confirmedAddress,
        embed: `https://maps.google.com/maps?q=${destination}&z=16&output=embed`,
        directions: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
    };
}
