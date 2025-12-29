'use client';

import { useState } from 'react';
import { X } from 'lucide-react'; // npm install lucide-react if missing, or use text "X"

export default function Header() {
	const [isAboutOpen, setIsAboutOpen] = useState(false);

	return (
		<>
			<header className="pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
				<h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 text-white/90">
					Visual Storyteller
				</h1>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-zinc-800 pt-6">
					<p className="max-w-md text-zinc-400 text-lg leading-relaxed font-light">
						Explorations in light, shadow, and human emotion. Captured on 85mm.
					</p>

					<div className="flex gap-6 text-sm tracking-widest uppercase text-zinc-500">
						{/* The Trigger Button */}
						<button
							onClick={() => setIsAboutOpen(true)}
							className="hover:text-white transition-colors"
						>
							About / Contact
						</button>
					</div>
				</div>
			</header>

			{/* THE ABOUT OVERLAY */}
			{isAboutOpen && (
				<div className="fixed inset-0 z-[60] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4">
					{/* Close Button */}
					<button
						onClick={() => setIsAboutOpen(false)}
						className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors"
					>
						<X size={32} />
					</button>

					<div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in duration-300">
						<h2 className="font-serif text-4xl md:text-5xl text-white">
							About the Artist
						</h2>

						<div className="space-y-6 text-zinc-300 font-light leading-relaxed text-lg">
							<p>
								Based in California, I specialize in cinematic portraiture that
								blends editorial fashion aesthetics with raw human emotion.
							</p>
							<p>
								My work is an exploration of identity, utilizing natural light
								and shadow to sculpt features and reveal the quiet intensity of
								my subjects.
							</p>
						</div>

						<div className="pt-8 border-t border-zinc-800 grid grid-cols-2 gap-8">
							<div>
								<h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
									Contact
								</h3>
								<a
									href="mailto:hello@example.com"
									className="block text-white hover:text-zinc-300 transition-colors"
								>
									hello@example.com
								</a>
							</div>
							<div>
								<h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
									Socials
								</h3>
								<a
									href="#"
									className="block text-white hover:text-zinc-300 transition-colors"
								>
									Instagram
								</a>
								<a
									href="#"
									className="block text-white hover:text-zinc-300 transition-colors"
								>
									Twitter / X
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
