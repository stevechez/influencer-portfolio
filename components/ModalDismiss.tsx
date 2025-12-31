"use client";

import { useRouter } from 'next/navigation';

export default function ModalDismiss({ 
  children, 
  className 
}: { 
  children?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div 
      className={className}
      onClick={() => router.back()} // <--- This restores the context!
    >
      {children}
    </div>
  );
}