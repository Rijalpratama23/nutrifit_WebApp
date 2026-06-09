'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, FileSearch, Sparkles, BookOpen, Target, ExternalLink } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/components/customeToast/CustomeToast';
import { getProgramContent } from '../../lib/programData';
import { getStoredReadArticles, mergeReadArticles, removeStoredReadArticle, type ReadArticle } from '../../lib/readHistory';
import type { ProgramTab } from '../../page';

interface ProgramSummary {
  id: string;
  title: string;
  description: string;
  guideDetail: string[];
  expertTarget: string[];
  categories: string[];
  latestRead: string;
  articleTitle: string;
  articleId: string;
  articleImage: string | null;
}

interface ContainerProps {
  activeTab: ProgramTab;
}

export default function Container({ activeTab }: ContainerProps) {
  const [articles, setArticles] = useState<ReadArticle[]>(() => getStoredReadArticles());
  const [loading, setLoading] = useState(true);

  const fetchReadHistory = async () => {
    setLoading(true);

    const storedArticles = getStoredReadArticles();
    if (storedArticles.length > 0) {
      setArticles(storedArticles);
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setArticles(storedArticles);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('user_article_reads').select('*').eq('user_id', session.user.id).order('last_read_at', { ascending: false });

      if (error) {
        console.error('Error fetching read history:', error);
        setArticles(storedArticles);
      } else {
        const mergedArticles = mergeReadArticles(storedArticles, data as ReadArticle[]);
        setArticles(mergedArticles);
      }
    } catch (err) {
      console.error('Error loading program page:', err);
      setArticles(storedArticles);
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

  const handleRemove = async (articleId: string) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus program ini dari daftar yang diminati?');

    if (!confirmed) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await supabase.from('user_article_reads').delete().eq('article_id', articleId).eq('user_id', session.user.id);
      }

      removeStoredReadArticle(articleId);
      setArticles((prev) => prev.filter((item) => item.article_id !== articleId));
      showSuccessToast({ title: 'Berhasil dihapus', message: 'Program berhasil dihapus dari daftar yang diminati.' });
    } catch (err) {
      console.error('Error removing saved article:', err);
      showErrorToast({ title: 'Gagal menghapus', message: 'Terjadi kesalahan saat menghapus program.' });
    }
  };

  const programs: ProgramSummary[] = Array.from(
    articles
      .reduce((map, article) => {
        const program = getProgramContent(article.article_category);
        const existing = map.get(program.id);

        if (existing) {
          existing.categories = Array.from(new Set([...existing.categories, article.article_category]));
          if (new Date(article.last_read_at) > new Date(existing.latestRead)) {
            existing.latestRead = article.last_read_at;
            existing.articleTitle = article.article_title;
            existing.articleImage = article.article_image_url;
          }
          return map;
        }

        map.set(program.id, {
          id: program.id,
          title: program.title,
          description: program.description,
          guideDetail: program.guideDetail,
          expertTarget: program.expertTarget,
          categories: [article.article_category],
          latestRead: article.last_read_at,
          articleTitle: article.article_title,
          articleId: article.article_id,
          articleImage: article.article_image_url,
        });

        return map;
      }, new Map<string, ProgramSummary>())
      .values(),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <FileSearch size={30} />
        <p className="text-xl font-semibold mt-4">Belum ada program diminati.</p>
        <p className="text-sm mt-2 text-center max-w-md">Baca artikel di halaman Artikel & Edukasi untuk menambahkan riwayat bacaan Anda ke program yang diminati.</p>
      </div>
    );
  }

  const renderProgramList = () => (
    <div className="space-y-4 sm:space-y-6">
      {programs.map((program) => (
        <div key={program.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="h-28 w-full sm:w-36 overflow-hidden rounded-2xl bg-gray-100">
                <Image src={program.articleImage ?? '/artikelUser/buahSayur.png'} alt={program.articleTitle} width={144} height={112} className="h-full w-full object-cover" />
              </div>

              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  <Sparkles size={16} />
                  {program.title}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{program.articleTitle}</h3>
                <p className="text-sm sm:text-base text-gray-600">{program.description}</p>
                <div className="flex flex-wrap gap-2">
                  {program.categories.map((category) => (
                    <span key={category} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
                      {category}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Terakhir dibaca:{' '}
                  {new Date(program.latestRead).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">Program diminati</div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/user/artikel/${program.articleId}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  <ExternalLink size={16} />
                  Lihat artikel
                </Link>
                <button type="button" onClick={() => handleRemove(program.articleId)} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGuideList = () => (
    <div className="space-y-4 sm:space-y-6">
      {programs.map((program) => (
        <div key={`${program.id}-guide`} className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 text-primary font-semibold mb-3">
            <BookOpen size={18} />
            <span>{program.title}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{program.description}</p>
          <ul className="space-y-2">
            {program.guideDetail.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-gray-700">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderTargetList = () => (
    <div className="space-y-4 sm:space-y-6">
      {programs.map((program) => (
        <div key={`${program.id}-target`} className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 text-primary font-semibold mb-3">
            <Target size={18} />
            <span>{program.title}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Target yang biasanya diprioritaskan oleh ahli untuk program ini.</p>
          <ul className="space-y-2">
            {program.expertTarget.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-gray-700">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  if (activeTab === 'guide') {
    return <div className="space-y-4">{renderGuideList()}</div>;
  }

  if (activeTab === 'target') {
    return <div className="space-y-4">{renderTargetList()}</div>;
  }

  return <div className="space-y-4">{renderProgramList()}</div>;
}
