import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseContainerSizeFromName(serviceType?: string | null): '20ft' | '40ft' | '45ft' | null {
    if (!serviceType) return null;
    const s = serviceType.toLowerCase();

    if (/(?:45'|45"|45\s*ft|45\s*feet|45\s*hc|45\s*hq|45\s*dc|45\s*rf|\b45\b)/i.test(s)) {
        return '45ft';
    }
    if (/(?:40'|40"|40\s*ft|40\s*feet|40\s*hc|40\s*hq|40\s*dc|40\s*gp|40\s*rf|\b40\b)/i.test(s)) {
        return '40ft';
    }
    if (/(?:20'|20"|20\s*ft|20\s*feet|20\s*hc|20\s*hq|20\s*dc|20\s*gp|20\s*rf|\b20\b)/i.test(s)) {
        return '20ft';
    }

    return null;
}

export function detectContainerSizeFromName(serviceType?: string | null): '20ft' | '40ft' | '45ft' {
    return parseContainerSizeFromName(serviceType) || '20ft';
}
