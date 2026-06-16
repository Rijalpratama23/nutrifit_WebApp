'use client';

import { useRouter } from 'next/navigation';

interface ButtonDashboardProps {
  text: string;
  background: string;
  destination: string;
}

export default function ButtonDashboard({ text, background, destination }: ButtonDashboardProps) {
  const router = useRouter();

  return (
    <button onClick={() => router.push(destination)} className={`${background} cursor-pointer text-white py-2 px-10 rounded-lg active:scale-95 transition-all duration-200`}>
      {text}
    </button>
  );
}
