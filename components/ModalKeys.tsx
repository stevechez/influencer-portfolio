"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ModalKeys({ prevId, nextId }: { prevId: string, nextId: string }) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') router.replace(`/p/${prevId}`);
      if (e.key === 'ArrowRight') router.replace(`/p/${nextId}`);
      if (e.key === 'Escape') router.back();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevId, nextId, router]);

  return null; // This component renders nothing, just handles logic
}