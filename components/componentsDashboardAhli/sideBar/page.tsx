'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, ChevronsRight, House, Users, HeartHandshake, ScrollText, CalendarCheck, User, LogOut, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useSidebar } from '@/hooks/useSidebar';
import { useState, useEffect, useCallback } from 'react'; // ✅ tambah ini
import { supabase } from '@/utils/supabase/client'; // ✅ tambah ini

export default function SideBar() {
  const { isCollapsed, setIsCollapsed, isMobile, isMobileOpen, setIsMobileOpen } = useSidebar();
  const pathname = usePathname();
  const [permintaanCount, setPermintaanCount] = useState(0);
  const fetchPermintaan = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Ambil ahli_profiles.id dulu
    const { data: ahliProfile } = await supabase.from('ahli_profiles').select('id').eq('user_id', session.user.id).eq('is_verified', true).maybeSingle();

    if (!ahliProfile) return;

    const { count } = await supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('ahli_id', ahliProfile.id).eq('status', 'pending');

    setPermintaanCount(count ?? 0);
  }, []);

  useEffect(() => {
    fetchPermintaan();

    // ✅ Realtime — update badge ketika ada INSERT/UPDATE di consultations
    const channel = supabase
      .channel('sidebar-permintaan')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultations',
        },
        () => {
          fetchPermintaan(); // re-fetch setiap ada perubahan
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPermintaan]);

  // ✅ navItems dengan badge dinamis
  const navItems = [
    { href: '/ahli/home', icon: <House size={24} />, label: 'Dashboard' },
    { href: '/ahli/permintaan', icon: <Users size={24} />, label: 'Permintaan', badge: permintaanCount },
    { href: '/ahli/konsultasi', icon: <HeartHandshake size={24} />, label: 'Konsultasi' },
    { href: '/ahli/riwayat', icon: <ScrollText size={24} />, label: 'Riwayat' },
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  function desktopLinkClass(href: string) {
    return ['flex items-center gap-3 font-semibold px-3 py-2 rounded-lg transition-colors', isCollapsed ? 'justify-center' : 'justify-between', isActive(href) ? 'bg-white text-primary' : 'text-white hover:bg-white/20'].join(' ');
  }

  function mobileLinkClass(href: string) {
    return ['flex gap-3 items-center text-xl font-semibold px-2 py-1 rounded-lg transition-colors', isActive(href) ? 'bg-white text-primary' : 'text-white hover:bg-white/20'].join(' ');
  }

  // ── MOBILE ────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-primary">
          <Image src="/logoPutih.png" alt="logo" width={120} height={10} />
          <button onClick={() => setIsMobileOpen(true)} className="text-white">
            <Menu size={28} />
          </button>
        </div>

        {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileOpen(false)} />}

        <div className={`fixed top-0 left-0 z-50 h-screen w-72 bg-primary rounded-r-2xl flex flex-col transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4">
            <Image src="/logoPutih.png" alt="logo" width={130} height={10} />
            <button onClick={() => setIsMobileOpen(false)} className="text-white">
              <X size={26} />
            </button>
          </div>

          <hr className="border-t border-white/40 mx-4" />

          <nav className="flex-1 flex flex-col justify-center px-4">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.label} className="flex items-center justify-between">
                  <Link href={item.href} className={mobileLinkClass(item.href)} onClick={() => setIsMobileOpen(false)}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                  {/* ✅ Badge mobile */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1">{item.badge > 99 ? '99+' : item.badge}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <hr className="border-t border-white/40 mx-4" />

          <div className="flex items-center justify-between p-4">
            <div className="p-2 rounded-full bg-gray-500">
              <User size={26} className="text-white" />
            </div>
            <Link href="/login">
              <LogOut size={26} className="text-red-500" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ── DESKTOP ───────────────────────────────────────────────
  return (
    <div className={`fixed top-0 left-0 z-50 h-screen bg-primary rounded-r-2xl flex flex-col transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-[72px]' : 'w-64'}`}>
      {/* Logo + toggle */}
      <div className={`flex items-center p-4 min-h-[64px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <Image src="/logoPutih.png" alt="logo" width={130} height={10} />}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white hover:bg-white/20 rounded-md p-1 transition-colors flex-shrink-0">
          {isCollapsed ? <ChevronsRight size={24} /> : <ChevronsLeft size={24} />}
        </button>
      </div>

      <hr className="border-t border-white/40 mx-3" />

      {/* Nav items */}
      <nav className="flex-1 flex flex-col justify-center px-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className={desktopLinkClass(item.href)} title={isCollapsed ? item.label : undefined}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex-shrink-0 relative">
                    {item.icon}
                    {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">{item.badge > 99 ? '99+' : item.badge}</span>
                    )}
                  </span>
                  {!isCollapsed && <span className="text-lg truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-gray-500 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1 flex-shrink-0">{item.badge > 99 ? '99+' : item.badge}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="border-t border-white/40 mx-3" />

      <div className={`flex items-center p-3 gap-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="p-2 rounded-full bg-gray-500 cursor-pointer flex-shrink-0">
          <Link href="/profile">
            <User size={24} className="text-white" />
          </Link>
        </div>
        {!isCollapsed && (
          <Link href="/login">
            <LogOut size={24} className="text-red-500" />
          </Link>
        )}
      </div>
    </div>
  );
}
