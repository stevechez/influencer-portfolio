import PortfolioGrid from '@/components/PortfolioGrid';
import Header from '@/components/Header'; // <--- Import the new header
import { getPortfolioImages } from '@/lib/cloudinary';

export const metadata = {
	title: 'Portfolio | Visual Storyteller',
	description: 'A curated collection of cinematic portraiture.',
};

export default async function Page() {
	const shots = await getPortfolioImages();

	return (
		<main className="min-h-screen bg-zinc-950 text-white font-sans">
			<Header /> {/* <--- Drop it in here */}
			<div className="px-4 md:px-8 max-w-[1600px] mx-auto pb-20">
				<PortfolioGrid shots={shots} />
			</div>
			<footer className="border-t border-zinc-900 py-12 text-center text-zinc-600 text-sm">
				<p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
			</footer>
		</main>
	);
}
