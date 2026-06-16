// components/button/buttonDashboard/page.tsx
'use client';

import Link from 'next/link';

interface ButtonDashboardProps {
  text: string;
  background: string;
  destination: string;
  variant?: 'primary' | 'secondary';
}

export default function ButtonSecDashboard({ text, background, destination, variant = 'primary' }: ButtonDashboardProps) {
  return (
    <Link href={destination}>
      <button
        className={`
          cursor-pointer py-2 px-10 rounded-lg active:scale-95 transition-all duration-200
          ${variant === 'secondary' ? 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white' : `${background} text-white`}
        `}
      >
        {text}
      </button>
    </Link>
  );
}
