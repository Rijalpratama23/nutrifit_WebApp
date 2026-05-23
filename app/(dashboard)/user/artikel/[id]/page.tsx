'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { ArrowLeft, Bookmark, Share2, Loader2 } from 'lucide-react';
import AppBar from '@/components/componentsDashboardUser/appBar/page';

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  created_at: string;
  author?: string;
}

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatTanggal(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}-${BULAN[d.getMonth()]}-${d.getFullYear()}`;
}

export default function PageBacaArtikel() {
  const params = useParams();
  const router = useRouter();
  const artikelId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch artikel detail
  useEffect(() => {
    if (!artikelId) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase.from('articles').select('*').eq('id', artikelId).eq('status', 'published').single();

        if (fetchError) throw fetchError;
        setArticle(data);

        // TODO: Check jika artikel sudah disimpan user
        // setIsSaved(true/false)
      } catch (err) {
        setError('Artikel tidak ditemukan');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [artikelId]);

  const handleSaveArticle = async () => {
    // TODO: Implementasi save artikel ke database
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    // TODO: Implementasi share artikel
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: 'Baca artikel ini di NutriFit',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share gagal:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar />
        <div className="flex items-center justify-center py-40">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <AppBar />
        <div className="flex flex-col items-center justify-center py-40 px-4">
          <p className="text-lg font-semibold text-gray-700 mb-6">{error || 'Artikel tidak ditemukan'}</p>
          <Link href="/user/artikel-user">
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">Kembali ke Artikel</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />

      {/* Header dengan tombol kembali */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 mt-10 md:mt-15 flex items-center justify-between">
          <Link href="/user/artikel-user">
            <button className="flex items-center gap-2 text-primary hover:text-primary transition cursor-pointer">
              <ArrowLeft size={20} />
              <span className="text-sm md:text-base">Kembali</span>
            </button>
          </Link>

          {/* Tombol Simpan & Share */}
          <div className="flex gap-3">
            <button onClick={handleSaveArticle} className={`p-2 cursor-pointer rounded-lg transition ${isSaved ? 'bg-blue-100 text-primary' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title="Simpan artikel">
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>

            <button onClick={handleShare} className="p-2 cursor-pointer rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition" title="Bagikan artikel">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Konten Artikel */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Kategori & Tanggal */}
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-primary text-xs md:text-sm rounded-full">{article.category}</span>
          <span className="text-xs md:text-sm text-gray-500 flex items-center">{formatTanggal(article.created_at)}</span>
        </div>

        {/* Judul */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>

        {/* Gambar */}
        {article.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden bg-gray-200 aspect-video relative">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/artikelUser/buahSayur.png';
              }}
            />
          </div>
        )}

        <article className="prose prose-sm md:prose-base max-w-none text-gray-800 leading-relaxed">
          <div
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br />')
                .replace(/<p><\/p>/g, '')
                .split('<p>')
                .map((p) => (p ? `<p>${p}</p>` : ''))
                .join(''),
            }}
          />
        </article>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8 md:my-12" />

        {/* CTA Kembali */}
        <div className="flex justify-center">
          <Link href="/user/artikel-user">
            <button className="px-8 py-3 bg-primary bg-blue text-white rounded-lg hover:bg-primary transition font-medium cursor-pointer">Lihat Artikel Lainnya</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
