"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 rtl:left-6 rtl:right-auto"
        >
          <Button
            onClick={scrollToTop}
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="h-5 w-5 shrink-0" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default ScrollToTopButton;
