import Image from 'next/image';
import Link from 'next/link';
import { Bell, CircleArrowLeft, UserRound } from 'lucide-react';

export default function AppBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] h-16 flex justify-between items-center px-6 md:px-10 bg-white shadow-md">
      <div className="logo md:flex justify-center items-center md:pt-5 md:pr-10">
        <Image src="/Logo.png" alt="logo" width={195} height={100} />
      </div>
      <nav className="md:flex ">
        <ul className="md:flex justify-between md:gap-15">
          <li className="font-semibold md:font-bold hover-text-primary">
            <Link href="#hero">Dashboard</Link>
          </li>
          <li className="font-semibold md:font-bold hover-text-primary">
            <Link href="#konsultasi">Konsultasi</Link>
          </li>
          <li className="font-semibold md:font-bold hover-text-primary">
            <Link href="#tim">Program</Link>
          </li>
          <li className="font-semibold md:font-bold hover-text-primary">
            <Link href="#tim">Rencana Nutrisi</Link>
          </li>
          <li className="font-semibold md:font-bold hover-text-primary">
            <Link href="#artikel">Artikel & Edukasi</Link>
          </li>
        </ul>
      </nav>

      <div className="md:flex justify-between items-center md:gap-5">
        <Link href="">
          <Bell className="font-bold" />
        </Link>
        <div className="flex justify-center gap-2 bg-primary p-2 rounded-2xl">
          {/* icon profile */}
          <div className='bg-white rounded-full p-1'>
            <UserRound size={20} />
          </div>
          {/* nama user */}
          <p className='text-white'>Jhondoe</p>
          <Link href="/profileConponents">
            <CircleArrowLeft className='text-white' />
          </Link>
        </div>
      </div>
    </header>
  );
}
