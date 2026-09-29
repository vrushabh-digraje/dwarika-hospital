import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function resolveImageUrl(url?: string | null): string {
    if (!url) return '';
    // Strips localhost/127.0.0.1:4000 so images load relatively via Vercel proxy (/uploads/...)
    return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000/, '');
}
