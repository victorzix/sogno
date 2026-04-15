import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-on-primary hover:opacity-90 whisper-shadow",
      secondary: "bg-surface-container-low text-primary hover:bg-surface-container-high",
      glass: "bg-surface-container-lowest/50 text-primary ghost-border hover:bg-surface-container-low glass",
    };

    const sizes = {
      default: "h-12 px-8 py-3",
      sm: "h-10 px-6 py-2 text-sm",
      lg: "h-14 px-10 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-sans font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
