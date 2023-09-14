import { MotionProps, motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>, // Exclude conflicting HTML button element props
  keyof MotionProps // from Framer Motion's MotionProps interface
> &
  MotionProps & { variant?: keyof typeof variants; loading?: boolean }; // and add Framer Motion's animation props

const variants = {
  primary: "bg-green-100 text-green-500 hover:bg-green-200 active:bg-green-300",
  secondary: "bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300",
  red: "bg-red-100 text-red-500 hover:bg-red-200 active:bg-red-300",
  dark: "bg-black text-white hover:bg-neutral-900 active:bg-neutral-800",
  none: "p-0",
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, loading, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      className={twMerge(
        "rounded-lg p-3 outline-none transition-colors focus:outline-none disabled:cursor-pointer",
        variants[loading ? "secondary" : variant ?? "none"],
        className,
      )}
      disabled={loading}
      {...props}
    >
      {children}
    </motion.button>
  ),
);

export default Button;
