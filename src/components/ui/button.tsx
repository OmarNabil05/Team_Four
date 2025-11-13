import { cloneElement, forwardRef, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
  asChild?: boolean;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'gold-gradient text-night font-semibold shadow-glow-gold hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent/70',
  outline:
    'border border-accent/60 text-accent hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent/40',
  ghost:
    'text-accent hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent/40',
};

const baseClassName =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    children,
    icon,
    variant = 'primary',
    loading = false,
    disabled,
    asChild = false,
    ...props
  }, ref) => {
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        className: clsx(
          baseClassName,
          variantClassNames[variant],
          disabled || loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
          child.props.className,
          className,
        ),
      });
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseClassName,
          variantClassNames[variant],
          disabled || loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {icon}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';
