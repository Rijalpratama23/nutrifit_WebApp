'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Cart from '../cart/page';
import { Loader2, FileSearch } from 'lucide-react';

interface ReadArticle {
  id: string;
  user_id: string;
  article_id: string;
  article_title: string;
  article_category: string;
  article_image_url: string | null;
  last_read_at: string;
}

export default function Container() {
  const [articles, setArticles] = useState<ReadArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReadHistory = async () => {
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setArticles([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('user_article_reads').select('*').eq('user_id', session.user.id).order('last_read_at', { ascending: false });

      if (error) {
        console.error('Error fetching read history:', error);
        setArticles([]);
      } else {
        setArticles(data as ReadArticle[]);
      }
    } catch (err) {
      console.error('Error loading program page:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadHistory();

    const channel = supabase
      .channel('user_article_reads_program')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_article_reads' }, () => fetchReadHistory())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await supabase.from('user_article_reads').delete().eq('id', id);
      setArticles((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error removing saved article:', err);
    }
  };

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
        <FileSearch size={30} />
        <p className="text-xl font-semibold mt-4">Belum ada program diminati.</p>
        <p className="text-sm mt-2 text-center max-w-md">Baca artikel di halaman Artikel & Edukasi untuk menambahkan riwayat bacaan Anda ke program yang diminati.</p>
      </div>
    );
  }

  return (
    <div className="border-1 rounded-xl p-5 md:p-2 space-y-4 sm:space-y-6 max-h-[320px] sm:max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thumb-gray-600 scrollbar-track-gray-100 scrollbar scrollbar-w-2">
      {articles.map((article) => (
        <Cart key={article.id} article={article} onRemove={handleRemove} />
      ))}
    </div>
  );
}
