"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PaymentMethodItem } from "./types";
import { paymentHoverVariants } from "./animations";

interface PaymentMethodsProps {
  methods: PaymentMethodItem[];
}

export function PaymentMethods({ methods }: PaymentMethodsProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
      {methods.map((method) => (
        <motion.div
          key={method.id}
          variants={paymentHoverVariants}
          initial="initial"
          whileHover="hover"
          className="w-14 h-9 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2 flex items-center justify-center shadow-sm select-none"
        >
          <Image
            src={method.logoSrc}
            alt={method.name}
            width={40}
            height={24}
            className="w-auto h-5 object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default PaymentMethods;
