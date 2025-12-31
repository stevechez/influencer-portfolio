import Image from 'next/image';
import Link from 'next/link';
import { getImageById, getPortfolioImages } from '@/lib/cloudinary';
import { notFound } from 'next/navigation';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ModalDismiss from '@/components/ModalDismiss'; 

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PhotoModal({ params }: PageProps) {
  const { id } = await params;
  const shot = await getImageById(id);
  const allShots = await getPortfolioImages(); 

  if (!shot || !allShots) return notFound();

  // Navigation Logic
  const currentIndex = allShots.findIndex((s) => s.id === id);
  const nextIndex = (currentIndex + 1) % allShots.length;
  const prevIndex = (currentIndex - 1 + allShots.length) % allShots.length;
  const nextId = allShots[nextIndex].id;
  const prevId = allShots[prevIndex].id;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center group/modal">
      {/* 1. Backdrop - Transparency is key here! */}
      <ModalDismiss className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-zoom-out" />

      {/* 2. Close Button */}
      <ModalDismiss className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors p-2 cursor-pointer">
        <X size={32} />
      </ModalDismiss>

      {/* 3. Navigation Arrows */}
      <Link href={`/p/${prevId}`} replace className="absolute left-4 md:left-8 z-50 p-4 text-white/30 hover:text-white transition-all hidden md:block">
        <ChevronLeft size={48} strokeWidth={1} />
      </Link>

      <Link href={`/p/${nextId}`} replace className="absolute right-4 md:right-8 z-50 p-4 text-white/30 hover:text-white transition-all hidden md:block">
        <ChevronRight size={48} strokeWidth={1} />
      </Link>

      {/* 4. The Image */}
      <div className="relative w-full h-full max-w-7xl max-h-[85vh] p-4 pointer-events-none flex items-center justify-center">
         <div className="relative w-full h-full pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
            <Image
              src={shot.url}
              alt={shot.scenario}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="100vw"
              priority
            />
         </div>

         {/* Caption */}
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-0 md:left-0 md:translate-x-0 pointer-events-auto text-center md:text-left">
            <h1 className="font-serif text-white text-xl md:text-2xl mb-1 drop-shadow-md">
                {shot.scenario}
            </h1>
        </div>
      </div>
    </div>
  );
}