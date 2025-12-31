"use client";

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Shot {
  id: string;
  url: string;
  width: number;
  height: number;
  scenario: string;
  tags: string[];
  blurDataURL?: string;
}

// --- SUB-COMPONENT: THE 3D TILT CARD ---
function TiltCard({ shot }: { shot: Shot }) {
  const ref = useRef<HTMLDivElement>(null);

  // 1. Motion Values for Mouse Position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 2. Physics Springs (Mass/Stiffness) for Smoothness
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // 3. Transform Mouse Position into Rotation Degrees
  // (Moving mouse left rotates image right, etc.)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // 4. The "Sheen" Gradient Movement
  const sheenX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const sheenY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/p/${shot.id}`} scroll={false} className="block relative cursor-none group perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d", // Critical for 3D effect
        }}
        className="relative w-full bg-zinc-900 overflow-hidden"
      >
        {/* THE IMAGE */}
        <div className="relative transform-gpu scale-[1.01]"> {/* Slight scale prevents edge pixelation */}
             <Image
              src={shot.url}
              alt={shot.scenario}
              width={800}
              height={(shot.height / shot.width) * 800}
              placeholder={shot.blurDataURL ? "blur" : "empty"}
              blurDataURL={shot.blurDataURL}
              className="w-full h-auto object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
        </div>

        {/* THE HOLOGRAPHIC SHEEN OVERLAY */}
        <motion.div 
            style={{
                background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.2), transparent 60%)`
            }}
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
        />
        
        {/* HOVER TEXT OVERLAY (Restored to VIEW SHOT) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <motion.div 
                style={{ z: 50 }} // Pushes text closer to camera
                className="bg-black/20 backdrop-blur-md border border-white/30 px-6 py-3"
            >
                <span className="text-[10px] uppercase tracking-[0.25em] text-white">
                  View Shot
                </span>
            </motion.div>
        </div>

      </motion.div>

      {/* CAPTION BELOW (Static) */}
      <div className="mt-4 flex justify-between items-baseline opacity-60 group-hover:opacity-100 transition-opacity duration-500">
        <h3 className="text-xs uppercase tracking-widest text-zinc-400">{shot.scenario}</h3>
        <span className="text-[10px] font-mono text-zinc-600">85MM</span>
      </div>
    </Link>
  );
}

// --- MAIN COMPONENT ---
export default function PortfolioGrid({ shots }: { shots: Shot[] }) {
  const [filter, setFilter] = useState("all");

  const categories = useMemo(() => {
    const allTags = shots.flatMap(shot => shot.tags);
    const uniqueTags = new Set(allTags);
    const cleanTags = Array.from(uniqueTags).filter(tag => 
      !tag.startsWith('model') && tag !== 'model'
    );
    return ["all", ...cleanTags.sort()];
  }, [shots]);

  const filteredShots = useMemo(() => {
    return filter === "all"
      ? shots
      : shots.filter(shot => shot.tags.includes(filter));
  }, [shots, filter]);

  return (
    <div>
      {/* FILTER BAR */}
      {categories.length > 1 && (
        <nav className="flex flex-wrap gap-8 mb-16 justify-center md:justify-start">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="group relative"
            >
              <span className={`text-[10px] tracking-[0.25em] uppercase transition-colors duration-500 ${
                filter === cat ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
              }`}>
                {cat}
              </span>
              {/* Animated Underline */}
              {filter === cat && (
                <motion.div 
                    layoutId="activeFilter"
                    className="absolute -bottom-2 left-0 right-0 h-[1px] bg-white"
                />
              )}
            </button>
          ))}
        </nav>
      )}

      {/* GRID */}
      <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
        <AnimatePresence mode='popLayout'>
          {filteredShots.map((shot, index) => (
            <motion.div
              layout
              key={shot.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }} // Ultra-smooth "luxury" easing
              className="break-inside-avoid"
            >
              <TiltCard shot={shot} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}