"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // 1. Lock the scroll while loading
    document.body.style.overflow = 'hidden';

    // 2. Animate the counter (0 to 100)
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // Adjust speed by changing increment or interval delay
      });
    }, 20);

    // 3. Dismiss loader after counter finishes + delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = ''; // Unlock scroll
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[999999] bg-zinc-950 flex items-center justify-center text-white"
          exit={{ y: "-100%" }} // Slide UP like a curtain
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // "Bezier" easing
        >
          {/* Central Counter / Branding */}
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="flex flex-col items-center gap-4"
          >
            <h1 className="font-serif text-4xl md:text-6xl tracking-tighter">
              VELVET
            </h1>
            <div className="font-mono text-xs overflow-hidden h-4 flex items-center">
               <span>LOADING... {counter}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}