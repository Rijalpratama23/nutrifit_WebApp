'use client';

import Link from 'next/link';

interface ButtonDashboardProps {
  text: string;
  background: string;
  destination: string;
}

export default function ButtonDashboard({ text, background, destination }: ButtonDashboardProps) {
  const router = useRouter();

  return (
    <Link href={destination}>
      <button className={`${background} cursor-pointer text-white py-2 px-10 rounded-lg active:scale-95 transition-all duration-200`}>{text}</button>
    </Link>
  );
}
