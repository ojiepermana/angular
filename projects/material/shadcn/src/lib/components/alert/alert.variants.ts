import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  [
    'relative w-full rounded-lg border p-4',
    '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]',
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive [&>svg]:text-destructive dark:border-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
