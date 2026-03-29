'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#hero');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const sections = ['#hero', '#konsultasi', '#tim', '#artikel'];

    const handleScroll = () => {
      let current = '#hero';

      sections.forEach((id) => {
        const section = document.querySelector(id);
        if (sections) {
          const rect = section.getBoundingClientRect();

          if (rect.top <= 150 && rect.bottom >= 150) {
            current = id;
          }
        }
      });
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] h-16 flex justify-between items-center px-6 md:px-10 bg-white shadow-md">
      {/* LOGO */}
      <div className="logo md:flex justify-center items-center md:pt-5 md:pr-10">
        <Image src="/Logo.png" alt="logo" width={200} height={100} />
      </div>

      {/* NAV DESKTOP */}
      <nav className="hidden md:flex">
        <ul className="md:flex justify-between md:gap-15">
          <li className={`font-semibold md:font-bold ${active === '#hero' ? 'text-primary' : ''}`}>
            <Link href="#hero" onClick={() => setActive('#hero')}>
              Beranda
            </Link>
          </li>
          <li className={`font-semibold md:font-bold ${active === '#konsultasi' ? 'text-primary' : ''}`}>
            <Link href="#konsultasi" onClick={() => setActive('#konsultasi')}>
              Konsultasi
            </Link>
          </li>
          <li className={`font-semibold md:font-bold ${active === '#tim' ? 'text-primary' : ''}`}>
            <Link href="#tim" onClick={() => setActive('#tim')}>
              Tim Ahli
            </Link>
          </li>
          <li className={`font-semibold md:font-bold ${active === '#artikel' ? 'text-primary' : ''}`}>
            <Link href="#artikel" onClick={() => setActive('#artikel')}>
              Artikel Kesehatan
            </Link>
          </li>
        </ul>
      </nav>

      {/* CTA DESKTOP */}
      <div className="hidden md:flex justify-between items-center md:gap-5">
        <Link href="/register">
          <p className="font-semibold">Daftar</p>
        </Link>
        <Link href="/login">
          <button className="bg-primary font-semibold px-6 py-2 text-white rounded-xl cursor-pointer">Masuk</button>
        </Link>
      </div>

      {/* HAMBURGER */}
      <button className="md:hidden z-[10000]" onClick={() => setOpen(!open)}>
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* OVERLAY */}
      {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" onClick={() => setOpen(false)} />}

      {/* MOBILE MENU */}
      <div
        ref={menuRef}
        onClick={() => setOpen(false)} // klik area putih → close
        className={`fixed top-0 left-0 h-full w-[75%] max-w-xs bg-white text-bold z-[9999] transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:hidden`}
      >
        {/* LOGO DI MENU */}
        <div className="logo py-3">
          <Image src="/Logo.png" alt="logo" width={200} height={100} />
        </div>

        {/* MENU ITEMS */}
        <div className="pt-10 px-6 flex flex-col items-start gap-6">
          <Link
            href="#hero"
            onClick={(e) => {
              e.stopPropagation(); // penting!
              setActive('#hero');
            }}
          >
            <p className={`font-semibold ${active === '#hero' ? 'text-primary' : ''}`}>Beranda</p>
          </Link>

          <Link
            href="#konsultasi"
            onClick={(e) => {
              e.stopPropagation();
              setActive('#konsultasi');
            }}
          >
            <p className={`font-semibold ${active === '#konsultasi' ? 'text-primary' : ''}`}>Konsultasi</p>
          </Link>

          <Link
            href="#tim"
            onClick={(e) => {
              e.stopPropagation();
              setActive('#tim');
            }}
          >
            <p className={`font-semibold ${active === '#tim' ? 'text-primary' : ''}`}>Tim Ahli</p>
          </Link>

          <Link
            href="#artikel"
            onClick={(e) => {
              e.stopPropagation();
              setActive('#artikel');
            }}
          >
            <p className={`font-semibold ${active === '#artikel' ? 'text-primary' : ''}`}>Artikel Kesehatan</p>
          </Link>

          {/* CTA */}
          <div className="flex flex-col items-start gap-4 mt-4 w-full">
            <Link href="/register" onClick={(e) => e.stopPropagation()}>
              <p className="font-semibold">Daftar</p>
            </Link>

            <Link href="/login" onClick={(e) => e.stopPropagation()}>
              <button className="bg-primary mb-5 font-semibold px-6 py-2 text-white rounded-xl w-fit cursor-pointer">Masuk</button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
