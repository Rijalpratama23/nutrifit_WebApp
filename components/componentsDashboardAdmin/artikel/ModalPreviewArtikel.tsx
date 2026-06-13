'use client';

import { X, Calendar, Tag, User, Eye } from 'lucide-react';

interface PreviewArticle {
  id: string;
  title: string;
  image: string;
  category: string;
  categoryColor: string;
  date: string;
  time: string;
  status: string;
  content?: string;
}

interface ModalPreviewArtikelProps {
  isOpen: boolean;
  onClose: () => void;
  article: PreviewArticle | null;
}

export default function ModalPreviewArtikel({ isOpen, onClose, article }: ModalPreviewArtikelProps) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Eye size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Preview Artikel</h2>
            <p className="text-xs text-gray-400">Tampilan artikel sebelum dipublikasikan</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* Thumbnail */}
          {article.image && !article.image.includes('placehold') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover rounded-xl mb-5" />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-xl mb-5 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Tidak ada thumbnail</span>
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${article.categoryColor}`}>{article.category}</span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                article.status === 'Berhasil Publish'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : article.status === 'Draft'
                    ? 'bg-gray-100 text-gray-500 border-gray-200'
                    : article.status === 'Archived'
                      ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                      : 'bg-red-50 text-red-500 border-red-200'
              }`}
            >
              {article.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{article.title}</h1>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-5 pb-5 border-b border-gray-100">
            <span className="flex items-center gap-1.5">
              <User size={12} />
              Admin Nutrifit
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {article.date} · {article.time}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={12} />
              {article.category}
            </span>
          </div>

          {/* Content */}
          {article.content ? (
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                prose-p:text-sm prose-p:leading-relaxed
                prose-ul:text-sm prose-li:text-sm
                prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Eye size={32} className="mb-2 opacity-30" />
              <p className="text-sm">Konten artikel tidak tersedia</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
