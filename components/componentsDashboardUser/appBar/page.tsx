'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, CircleArrowLeft, UserRound, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

export default function AppBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUser();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-20 flex justify-between items-center px-6 md:px-10 bg-white shadow-md">
        <div className="logo flex justify-center items-center">
          <Image src="/Logo.png" alt="logo" width={150} height={50} />
        </div>

        {/* Tombol Hamburger/X - Mobile Only */}
        <div className="md:hidden flex items-center z-[1002]">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none transition-colors hover-text-primary">
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex">
          <ul className="flex justify-between md:gap-10">
            <li className="font-semibold md:font-bold">
              <Link href="/user/dashboardUser" className="cursor-pointer hover-text-primary transition-all duration-300">
                Dashboard
              </Link>
            </li>
            <li className="font-semibold md:font-bold">
              <Link href="/user/konsultasi" className="cursor-pointer hover-text-primary transition-all duration-300">
                Konsultasi
              </Link>
            </li>
            <li className="font-semibold md:font-bold">
              <Link href="/user/program" className="cursor-pointer hover-text-primary transition-all duration-300">
                Program
              </Link>
            </li>
            <li className="font-semibold md:font-bold">
              <Link href="/user/rencanaNutrisi" className="cursor-pointer hover-text-primary transition-all duration-300">
                Rencana Nutrisi
              </Link>
            </li>
            <li className="font-semibold md:font-bold">
              <Link href="/user/artikel-user" className="cursor-pointer hover-text-primary transition-all duration-300">
                Artikel & Edukasi
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile Desktop */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="" className="group">
            <Bell size={24} className="text-gray-700 group-hover:hover-text-primary transition-all duration-300" />
          </Link>
          <div className="flex items-center gap-3 bg-primary py-1.5 pl-2 pr-2 rounded-full shadow-md hover:brightness-110 transition-all cursor-pointer">
            <div className="bg-white rounded-full p-1.5 text-primary">
              <UserRound size={18} strokeWidth={2.5} />
            </div>
            <p className="text-white font-semibold text-sm">{loading ? 'Loading...' : user?.name || 'User'}</p>
            <Link href="/profileComponents" className="cursor-pointer">
              <CircleArrowLeft className="text-white hover:scale-110 transition-transform" size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR & OVERLAY --- */}
      <div className={`fixed inset-0 bg-black/40 z-[1000] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)} />

      <div className={`fixed top-0 left-0 bottom-0 w-[75%] bg-white z-[1001] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="mb-10 pt-2">
            <Image src="/Logo.png" alt="logo" width={120} height={40} />
          </div>

          <nav className="flex flex-col gap-8 flex-1">
            <ul className="flex flex-col gap-6">
              <li className="font-medium text-gray-700" onClick={() => setIsOpen(false)}>
                <Link href="/user/dashboardUser" className="cursor-pointer hover-text-primary transition-all duration-300 block w-full">
                  Beranda
                </Link>
              </li>
              <li className="font-medium text-gray-700" onClick={() => setIsOpen(false)}>
                <Link href="/user/konsultasi" className="cursor-pointer hover-text-primary transition-all duration-300 block w-full">
                  Konsultasi
                </Link>
              </li>
              <li className="font-medium text-gray-700" onClick={() => setIsOpen(false)}>
                <Link href="/user/program" className="cursor-pointer hover-text-primary transition-all duration-300 block w-full">
                  Program
                </Link>
              </li>
              <li className="font-medium text-gray-700" onClick={() => setIsOpen(false)}>
                <Link href="/user/rencanaNutrisi" className="cursor-pointer hover-text-primary transition-all duration-300 block w-full">
                  Rencana Nutrisi
                </Link>
              </li>
              <li className="font-medium text-gray-700" onClick={() => setIsOpen(false)}>
                <Link href="/user/artikel-user" className="cursor-pointer hover-text-primary transition-all duration-300 block w-full">
                  Artikel Kesehatan
                </Link>
              </li>
            </ul>

            {/* Bagian Profil Mobile */}
            <div className="mt-4 pt-8 border-t border-gray-100 flex flex-col gap-6">
              <div className="flex items-center gap-4 text-gray-600 hover-text-primary transition-colors cursor-pointer group" onClick={() => setIsOpen(false)}>
                <Bell size={22} className="group-hover:hover-text-primary" />
                <span className="font-medium">Notifikasi</span>
              </div>

              <div className="flex items-center justify-between bg-primary p-2 rounded-2xl w-full pr-4 shadow-sm hover:brightness-110 transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-1.5 text-primary">
                    <UserRound size={18} strokeWidth={2.5} />
                  </div>
                  <p className="text-white font-semibold text-sm">{loading ? 'Loading...' : user?.name || 'User'}</p>
                </div>
                <Link href="/profileComponents" onClick={() => setIsOpen(false)} className="cursor-pointer">
                  <CircleArrowLeft className="text-white hover:scale-110 transition-transform" size={22} />
                </Link>
              </div>
            </div>
          </nav>

          <p className="text-[10px] text-gray-300 text-center mt-auto italic">Nutrifit v1.0</p>
        </div>
      </div>
    </>
  );
}
