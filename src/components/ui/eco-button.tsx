import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ecoButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-eco hover:bg-primary/90 hover:shadow-glow hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-eco",
        eco: "bg-gradient-eco text-white shadow-eco hover:shadow-glow hover:scale-105 animate-pulse-glow",
        earth: "bg-gradient-earth text-white shadow-eco hover:shadow-glow hover:scale-105",
        outline: "border border-primary/20 bg-background hover:bg-eco-light hover:border-primary/40 hover:shadow-eco",
        ghost: "hover:bg-eco-light hover:text-eco-dark transition-colors",
        destructive: "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EcoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ecoButtonVariants> {
  asChild?: boolean
}

const EcoButton = React.forwardRef<HTMLButtonElement, EcoButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(ecoButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
EcoButton.displayName = "EcoButton"

export { EcoButton, ecoButtonVariants }