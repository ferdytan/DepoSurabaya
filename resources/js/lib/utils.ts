import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function detectContainerSizeFromName(serviceType?: string | null): '20ft' | '40ft' | '45ft' {
    if (!serviceType) return '20ft';
    const s = serviceType.toLowerCase();

    if (/\b45\b|45'|45\s*ft|45\s*feet/i.test(s)) {
        return '45ft';
    }
    if (/\b40\b|40'|40\s*ft|40\s*feet/i.test(s)) {
        return '40ft';
    }
    if (/\b20\b|20'|20\s*ft|20\s*feet/i.test(s)) {
        return '20ft';
    }

    return '20ft';
}
