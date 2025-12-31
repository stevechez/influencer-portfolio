"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import HyperText from '@/components/HyperText';

export default function HomeHeader() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <header className="px-8 py-12 md:p-12 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 overflow-hidden">
        {/* BRANDING */}
        <div>
          <h1 className="flex flex-col md:block items-start leading-none text-white overflow-hidden">
            {/* STAGGERED REVEAL */}
            <motion.span 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }} // Cubic bezier for "luxury" feel
              className="font-serif text-6xl md:text-8xl tracking-tighter font-bold block"
            >
              VELVET
            </motion.span>
            
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-sans text-xs md:text-sm tracking-[0.4em] text-zinc-400 md:ml-4 uppercase font-light block mt-2 md:mt-0"
            >
              .Studio
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-6 text-zinc-500 max-w-md font-light text-sm leading-relaxed"
          >
            A curated collective of digital personalities. <br className="hidden md:block" />
            Exploring the boundaries of identity and light.
          </motion.p>
        </div>

        {/* NAVIGATION / INFO */}
        <div className="text-left md:text-right space-y-4 md:space-y-1 w-full md:w-auto flex flex-row md:flex-col justify-between items-end">
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="space-y-1"
           >
              <p className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Est. 2025</p>
              <p className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Rio del Mar, CA</p>
           </motion.div>
           
           <button onClick={() => setIsAboutOpen(true)} className="...">
   <HyperText text="About / Contact" />
</button>
        </div>
      </header>

      {/* OVERLAY (Keep existing logic here) */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4">
            <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors"
            >
                <X size={32} />
            </button>
            
            {/* Animate the content inside the overlay too! */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full space-y-8"
            >
                <h2 className="font-serif text-4xl md:text-5xl text-white">Velvet Studio</h2>
                {/* ... (rest of your About content) ... */}
            </motion.div>
        </div>
      )}
    </>
  );
}