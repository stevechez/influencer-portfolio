import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google'; // Assuming you use these fonts
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';

const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Velvet Studio',
  description: 'Digital Agency Portfolio',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      {/* NOTE: We add 'cursor-none' here to hide the default mouse 
         so our Custom Orb can shine.
      */}
      <body className="bg-zinc-950 text-white antialiased cursor-none selection:bg-white/20">
        <div className="fixed inset-0 pointer-events-none z-[50] opacity-20 mix-blend-overlay">
  <svg className="w-full h-full">
    <filter id="noise">
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency="0.80" 
        numOctaves="4" 
        stitchTiles="stitch" 
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
</div>
        <SmoothScroll>
          {/* 1. The Custom Cursor lives here */}
          <CustomCursor />
          
          {/* 2. The Main Page Content */}
          {children}
          
          {/* 3. The Lightbox Overlay */}
          {modal}
        </SmoothScroll>
        
      </body>
    </html>
  );
}