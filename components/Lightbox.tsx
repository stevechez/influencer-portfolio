'use client'; // This component needs interaction

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react'; // install lucide-react if needed, or use text < >

// Re-defining the interface here locally or import it if you have a types file
interface Shot {
	id: string | number;
	url: string;
	scenario: string;
	width: number;
	height: number;
}

interface LightboxProps {
	shots: Shot[]; // We pass all shots so we can navigate between them
	initialIndex: number;
	onClose: () => void;
}

export default function Lightbox({
	shots,
	initialIndex,
	onClose,
}: LightboxProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	// Function to go to next image
	const nextImage = useCallback(() => {
		setCurrentIndex(prev => (prev + 1) % shots.length);
	}, [shots.length]);

	// Function to go to previous image
	const prevImage = useCallback(() => {
		setCurrentIndex(prev => (prev - 1 + shots.length) % shots.length);
	}, [shots.length]);

	// Handle Keyboard Navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowRight') nextImage();
			if (e.key === 'ArrowLeft') prevImage();
		};

		window.addEventListener('keydown', handleKeyDown);
		// Lock body scroll when modal is open
		document.body.style.overflow = 'hidden';

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'auto';
		};
	}, [onClose, nextImage, prevImage]);

	const currentShot = shots[currentIndex];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
			{/* Close Button */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
			>
				<X size={32} />
			</button>

			{/* Prev Button */}
			<button
				onClick={e => {
					e.stopPropagation();
					prevImage();
				}}
				className="absolute left-4 z-50 p-2 text-white/50 hover:text-white transition-colors hidden md:block"
			>
				<ChevronLeft size={48} />
			</button>

			{/* Main Image Container */}
			<div
				className="relative w-full h-full max-w-7xl flex items-center justify-center"
				onClick={onClose} // Clicking background closes modal
			>
				<div
					className="relative w-full h-full"
					onClick={e => e.stopPropagation()} // Clicking image doesn't close modal
				>
					<Image
						src={currentShot.url}
						alt={currentShot.scenario}
						fill
						className="object-contain" // Keeps aspect ratio, doesn't crop
						quality={100}
						priority // Load this immediately
					/>
				</div>

				{/* Caption Overlay */}
				<div className="absolute bottom-4 left-0 right-0 text-center text-white/80 pointer-events-none">
					<p className="text-sm font-light tracking-widest uppercase">
						{currentShot.scenario}
					</p>
				</div>
			</div>

			{/* Next Button */}
			<button
				onClick={e => {
					e.stopPropagation();
					nextImage();
				}}
				className="absolute right-4 z-50 p-2 text-white/50 hover:text-white transition-colors hidden md:block"
			>
				<ChevronRight size={48} />
			</button>
		</div>
	);
}
