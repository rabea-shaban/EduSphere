import type { Variants } from "framer-motion";

export const floatingButtonVariants: Variants = {
  initial: { y: 0, scale: 1 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  hover: {
    scale: 1.08,
    transition: { duration: 0.2 },
  },
};

export const socialHoverVariants: Variants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.1,
    y: -3,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const paymentHoverVariants: Variants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};
