'use client'; // IMPORTANT: Must be at the very top now!

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox'; // Import the new component
import { motion } from 'framer-motion';

interface Shot {
	id: string | number;
	url: string;
	scenario: string;
	width: number;
	height: number;
	blurDataURL?: string; // Add this
	tags: string[]; // Add this
}

export default function PortfolioGrid({ shots }: { shots: Shot[] }) {
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const [filter, setFilter] = useState<string>('all');

	const categories = useMemo(() => {
		// 1. Get all unique tags from the shots
		const uniqueTags = new Set(shots.flatMap(shot => shot.tags));

		// 2. Define YOUR preferred order
		const preferredOrder = ['nature', 'beach', 'city', 'home'];

		// 3. Sort: First your preferred ones, then any others found alphabetically
		const sortedTags = Array.from(uniqueTags).sort((a, b) => {
			const indexA = preferredOrder.indexOf(a);
			const indexB = preferredOrder.indexOf(b);

			// If both are in your preferred list, sort by that order
			if (indexA !== -1 && indexB !== -1) return indexA - indexB;
			// If only A is in the list, it comes first
			if (indexA !== -1) return -1;
			// If only B is in the list, it comes first
			if (indexB !== -1) return 1;
			// Otherwise sort alphabetically
			return a.localeCompare(b);
		});

		return ['all', ...sortedTags];
	}, [shots]);

	const filteredShots = useMemo(() => {
		if (filter === 'all') return shots;
		return shots.filter(shot => shot.tags.includes(filter));
	}, [shots, filter]);

	return (
		<>
			{/* REFINED FILTER BAR */}
			<nav className="flex flex-wrap gap-x-8 gap-y-4 mb-12 items-center text-sm md:text-base">
				<span className="text-zinc-500 font-serif italic pr-4 border-r border-zinc-800 hidden md:block">
					Filter by:
				</span>
				{categories.map(category => (
					<button
						key={category}
						onClick={() => setFilter(category)}
						className={`uppercase tracking-[0.2em] text-xs transition-all duration-300 relative group ${
							filter === category
								? 'text-white'
								: 'text-zinc-500 hover:text-zinc-300'
						}`}
					>
						{category}
						{/* Elegant Underline Animation */}
						<span
							className={`absolute -bottom-2 left-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left ${
								filter === category
									? 'scale-x-100'
									: 'scale-x-0 group-hover:scale-x-50'
							}`}
						/>
					</button>
				))}
			</nav>

			{/* THE GRID */}
			<div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
				{filteredShots.map((shot, index) => (
					<motion.div // <--- 2. Change <div> to <motion.div>
						key={shot.id}
						layout // <--- 3. Smoothly animates layout changes when filtering!
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-50px' }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						onClick={() => setSelectedIndex(index)}
						className="break-inside-avoid relative group cursor-pointer mb-6"
					>
						{/* ... (Keep your existing Image and Caption code) ... */}
						<div className="relative overflow-hidden grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 ease-out">
							<Image
								src={shot.url}
								alt={shot.scenario}
								width={800}
								height={(shot.height / shot.width) * 800}
								placeholder="blur"
								blurDataURL={shot.blurDataURL}
								className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
							<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						</div>

						<div className="mt-3 flex justify-between items-start opacity-70 group-hover:opacity-100 transition-opacity duration-500">
							<span className="text-xs tracking-widest uppercase text-zinc-400 font-medium">
								{shot.scenario.split('.')[0]}
							</span>
							<span className="text-[10px] text-zinc-600 font-mono border border-zinc-800 px-1 rounded">
								0{index + 1}
							</span>
						</div>
					</motion.div>
				))}
			</div>

			{/* Lightbox (unchanged) */}
			{selectedIndex >= 0 && (
				<Lightbox
					shots={filteredShots}
					initialIndex={selectedIndex}
					onClose={() => setSelectedIndex(-1)}
				/>
			)}
		</>
	);
}
