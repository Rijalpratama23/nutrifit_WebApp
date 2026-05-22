'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Cart from './cart/page';
import { Loader2 } from 'lucide-react';

interface Artikel {
  id: string;
  title: string;
  image_url: string | null;
  created_at: string;
  category: string;
}

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatTanggal(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

interface Props {
  kategori?: string; // filter dari SelectArtikel
}

export default function CartArtikel({ kategori = 'Semua' }: Props) {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch artikel published ───────────────────────────────────
  const fetchArticles = async (kat: string) => {
    setLoading(true);
    let query = supabase.from('articles').select('id, title, image_url, created_at, category').eq('status', 'published').order('created_at', { ascending: false });

    if (kat !== 'Semua') {
      query = query.eq('category', kat);
    }

    const { data } = await query;
    setArticles(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles(kategori);
  }, [kategori]);

  // ── Realtime subscription ─────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('artikel-user-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => fetchArticles(kategori))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [kategori]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-sm font-medium">Belum ada artikel tersedia.</p>
        <p className="text-xs mt-1">Cek kembali nanti ya!</p>
      </div>
    );
  }

  return (
    <div className="mx-4 md:mx-8 lg:mx-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-15 h-180 md:h-200 py-5 md:py-10 overflow-y-auto">
      {articles.map((article) => (
        <Cart key={article.id} id={article.id} gambar={article.image_url ?? '/artikelUser/buahSayur.png'} deskripsi={article.title} tanggalPublish={formatTanggal(article.created_at)} />
      ))}
    </div>
  );
}
