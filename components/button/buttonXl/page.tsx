'use client';

import Link from 'next/link';

export default function ButtonXl({ title }: { title: string }) {
  return (
    <div>
      <Link href="/login">
        <button className="bg-primary text-white font-semibold py-2 px-4 md:py-4 md:px-6 rounded-xl text-sm md:text-base active:scale-95 transition-all duration-200">{title}</button>
      </Link>
    </div>
  );
}
