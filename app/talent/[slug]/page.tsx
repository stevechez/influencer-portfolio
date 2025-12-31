import PortfolioGrid from '@/components/PortfolioGrid';
import { getPortfolioImages } from '@/lib/cloudinary';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// 1. Update the type: params is now a Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

// 2. Metadata must also await params
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; 
  const name = slug.replace('model-', '').toUpperCase();
  return {
    title: `${name} | Agency Portfolio`,
  };
}

export default async function TalentPage({ params }: PageProps) {
  // 3. CRITICAL FIX: Await the params object
  const { slug } = await params;

  // 4. Now 'slug' is a real string, so this fetch works
  const shots = await getPortfolioImages(slug);

  if (!shots || shots.length === 0) {
    return notFound();
  }

  // 5. And this replace function works (no longer undefined)
  const displayName = slug.replace('model-', '').replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans">
      <nav className="p-8 flex justify-between items-center text-xs tracking-widest uppercase text-zinc-500">
        <a href="/" className="hover:text-white transition-colors">← Back to Roster</a>
        <span>Agency.Studio</span>
      </nav>

      <header className="px-6 md:px-12 pb-12 pt-4 text-center">
        <h1 className="font-serif text-5xl md:text-7xl mb-4 text-white/90 capitalize">
          {displayName}
        </h1>
        <p className="text-zinc-400 text-sm tracking-widest uppercase">
          Full Portfolio
        </p>
      </header>

      <div className="px-4 md:px-8 max-w-[1600px] mx-auto pb-20">
        <PortfolioGrid shots={shots} />
      </div>
    </main>
  );
}