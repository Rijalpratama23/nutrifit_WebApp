'use client';

import { Calendars } from 'lucide-react';
import Image from 'next/image';
import Cta from '../btn/page';

interface CartProps {
  article: {
    id: string;
    article_title: string;
    article_category: string;
    article_image_url: string | null;
    last_read_at: string;
  };
  onRemove: (id: string) => void;
}

export default function Cart({ article, onRemove }: CartProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start sm:items-center">
        <Image src={article.article_image_url ?? '/image.png'} alt={article.article_title} width={200} height={200} className="items-center md:items-start rounded-2xl object-cover" />
        <div className="flex-1">
          <h3 className="font-semibold text-lg sm:text-xl md:text-2xl">{article.article_title}</h3>
          <p className="text-sm sm:text-base text-gray-500 mt-2">Kategori: {article.article_category}</p>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Terakhir dibaca:{' '}
            {new Date(article.last_read_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between items-start sm:items-end gap-3 sm:gap-4">
        <div className="activeOrNote bg-green-200 py-1 px-3 sm:py-1.5 sm:px-4 rounded-lg sm:rounded-xl flex-shrink-0">
          <p className="text-secondary text-xs sm:text-sm md:text-base font-semibold">Program diminati</p>
        </div>
        <div className="flex gap-3">
          <Cta />
          <button type="button" onClick={() => onRemove(article.id)} className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
