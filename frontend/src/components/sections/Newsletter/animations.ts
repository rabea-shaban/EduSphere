import type { Variants } from "framer-motion";

export const envelopeFloatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-6, 6, -6],
    transition: {
      duration: 4.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const planeFlyVariants: Variants = {
  initial: { x: 0, y: 0 },
  animate: {
    x: [0, 4, 0],
    y: [0, -4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
