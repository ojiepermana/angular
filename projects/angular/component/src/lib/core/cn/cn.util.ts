import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Concatenate and dedupe Tailwind class names.
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-primary', props.class)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
