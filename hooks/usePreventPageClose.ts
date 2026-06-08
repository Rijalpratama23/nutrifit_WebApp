'use client';

import { useEffect } from 'react';
import { useUser } from './useUser';

export function usePreventPageClose() {
  const { user, loading } = useUser();

  useEffect(() => {
    // Hanya jalankan jika user sudah login dan tidak sedang loading
    if (loading || !user) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Tampilkan dialog konfirmasi
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    // Tambahkan event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, loading]);
}
