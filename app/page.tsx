import Link from 'next/link';
import Image from 'next/image';
import HomeHeader from '@/components/HomeHeader'; // <--- Import the new header

// Define your SEO Metadata here
export const metadata = {
  title: 'Velvet Studio | Digital Model Agency',
  description: 'A curated collective of AI personalities based in Rio del Mar.',
}

// Ensure your links here are REAL Cloudinary URLs!
const roster = [
  {
    id: 'model-sarah', 
    name: 'Sarah',
    title: 'The Muse',
    image: 'https://res.cloudinary.com/stevechez/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1767023575/portfolio/Model%20-%20Sarah.png' 
  },
  {
    id: 'model-aria',
    name: 'Aria',
    title: 'Editorial',
    image: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234/portfolio/aria_cover.jpg'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      
      {/* 1. Use the Interactive Header */}
      <HomeHeader />

      {/* 2. Roster Grid */}
      <div className="flex-1 max-w-[1800px] mx-auto w-full px-6 py-16 md:py-24">
        <span className="text-[10px] tracking-widest text-zinc-600 uppercase mb-8 block">Represented Talent</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {roster.map((model) => (
            <Link 
              key={model.id} 
              href={`/talent/${model.id}`} 
              className="group block"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-zinc-900 mb-6">
                 {/* The pulsing placeholder while image loads */}
                 <div className="absolute inset-0 bg-zinc-800 animate-pulse -z-10" /> 
                 
                 <Image 
                    src={model.image} 
                    alt={model.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, 33vw"
                 />
              </div>

              <div className="flex justify-between items-baseline border-b border-zinc-800 pb-4 group-hover:border-white transition-colors duration-500">
                <h2 className="text-3xl font-serif font-medium">{model.name}</h2>
                <span className="text-xs tracking-widest text-zinc-500 uppercase group-hover:text-white transition-colors">
                  {model.title} ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}