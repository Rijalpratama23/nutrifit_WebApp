'use client';

import { useState, useEffect } from 'react';
import { Upload, Calendar, ChevronDown, Users, Stethoscope, ClipboardList, FileText, Search, RotateCcw, Eye, Pencil, MoreVertical, ChevronLeft, ChevronRight, RefreshCw, Loader } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import ModalUploadArtikel from '../ModalUploadArtikel';
import { supabase } from '@/utils/supabase/client';

type StatusType = 'Berhasil Publish' | 'Gagal Publish' | 'Draft' | 'Archived';

interface DatabaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  status: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface Article {
  id: string;
  image: string;
  title: string;
  category: string;
  categoryColor: string;
  date: string;
  time: string;
  timestamp: number; // Unix timestamp untuk sorting
  status: StatusType;
  errorReason?: string;
}

// Dummy data untuk development (akan diganti dengan data dari database)
const dummyArticles: Article[] = []; // Data dummy - akan diganti dengan data real dari database

// Helper functions
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Gaya Hidup Sehat': 'bg-green-100 text-green-700',
    'Diet & Nutrisi': 'bg-blue-100 text-blue-700',
    'Kesehatan Fisik': 'bg-purple-100 text-purple-700',
  };
  return colorMap[category] || 'bg-gray-100 text-gray-700';
};

const mapDatabaseToArticle = (dbArticle: DatabaseArticle): Article => {
  const createdDate = new Date(dbArticle.created_at);
  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let statusType: StatusType = 'Draft';
  if (dbArticle.status === 'published') {
    statusType = 'Berhasil Publish';
  } else if (dbArticle.status === 'draft') {
    statusType = 'Draft';
  } else if (dbArticle.status === 'archived') {
    statusType = 'Archived';
  }

  return {
    id: dbArticle.id,
    image: dbArticle.image_url || 'https://placehold.co/48x48/cccccc/fff?text=📄',
    title: dbArticle.title,
    category: dbArticle.category,
    categoryColor: getCategoryColor(dbArticle.category),
    date: dateFormatter.format(createdDate),
    time: timeFormatter.format(createdDate),
    timestamp: createdDate.getTime(),
    status: statusType,
  };
};

const tabs = ['Semua Artikel', 'Berhasil Publish', 'Gagal Publish', 'Draft', 'Archived'] as const;
type TabType = (typeof tabs)[number];

const kategoriOptions = ['Semua Kategori', 'Gaya Hidup Sehat', 'Diet & Nutrisi', 'Kesehatan Fisik'];
const statusOptions = ['Semua Status', 'Berhasil Publish', 'Gagal Publish', 'Draft', 'Archived'];
const sortOptions = ['Urutan Terbaru', 'Urutan Terlama', 'A - Z', 'Z - A'];

function StatusBadge({ status }: { status: StatusType }) {
  const map: Record<StatusType, string> = {
    'Berhasil Publish': 'bg-green-100 text-green-600 border border-green-200',
    'Gagal Publish': 'bg-red-100 text-red-500 border border-red-200',
    Draft: 'bg-gray-100 text-gray-500 border border-gray-200',
    Archived: 'bg-yellow-100 text-yellow-600 border border-yellow-200',
  };
  return <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${map[status]}`}>{status}</span>;
}

function StatCard({ label, count, unit, icon, bg, textColor, border }: { label: string; count: number; unit: string; icon: React.ReactNode; bg: string; textColor: string; border?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 min-h-30 sm:min-h-35 ${border ? 'bg-white border border-gray-200 shadow-sm' : bg}`}>
      <div className="flex items-start justify-between">
        <p className={`text-sm sm:text-base font-bold ${border ? 'text-gray-700' : 'text-white'}`}>{label}</p>
        <div className={`rounded-full p-2 ${border ? 'bg-blue-50 text-blue-500' : 'bg-white/20 text-white'}`}>{icon}</div>
      </div>
      <p className={`text-3xl sm:text-4xl font-bold ${border ? textColor : 'text-white'}`}>
        {count} <span className={`text-sm sm:text-base font-normal ${border ? 'text-gray-400' : 'text-white/80'}`}>{unit}</span>
      </p>
      <button className={`text-xs sm:text-sm font-semibold text-left transition-colors ${border ? 'text-blue-500 hover:text-blue-700' : 'text-white hover:text-white/80'}`}>Lihat Detail</button>
    </div>
  );
}

function Select({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer w-full"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function MobileArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 space-y-2">
      <div className="flex gap-3 items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{article.title}</p>
          <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${article.categoryColor}`}>{article.category}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {article.date} · {article.time}
        </div>
        <StatusBadge status={article.status} />
      </div>
      {article.errorReason && <p className="text-[10px] text-red-400 bg-red-50 rounded-lg px-2 py-1 leading-snug">{article.errorReason}</p>}
      <div className="flex gap-2 pt-1">
        <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium">
          <Eye size={13} /> Lihat
        </button>
        <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium">
          <Pencil size={13} /> Edit
        </button>
        {article.status === 'Gagal Publish' && (
          <button className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-700 font-medium ml-auto">
            <RefreshCw size={13} /> Coba Publish Ulang
          </button>
        )}
      </div>
    </div>
  );
}

export default function ContainerArtikel() {
  const [activeTab, setActiveTab] = useState<TabType>('Semua Artikel');
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('Semua Kategori');
  const [status, setStatus] = useState('Semua Status');
  const [sort, setSort] = useState('Urutan Terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const { isCollapsed, isMobile } = useSidebar();

  // Fetch articles dari database
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });

      if (error) throw error;

      const mappedArticles = (data as DatabaseArticle[]).map(mapDatabaseToArticle);
      setArticles(mappedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback ke dummy data jika error
      setArticles(dummyArticles);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat component mount
  useEffect(() => {
    fetchArticles();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('articles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
        fetchArticles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Reset pagination ke halaman 1 ketika filter atau sort berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, kategori, status, activeTab, sort, dateRange]);

  const filteredArticles = articles.filter((a) => {
    const matchTab = activeTab === 'Semua Artikel' || a.status === activeTab;
    const matchSearch = search === '' || a.title.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === 'Semua Kategori' || a.category === kategori;
    const matchStatus = status === 'Semua Status' || a.status === status;
    const matchDateRange = !dateRange.from || !dateRange.to || (a.timestamp >= dateRange.from.getTime() && a.timestamp <= dateRange.to.getTime());
    return matchTab && matchSearch && matchKategori && matchStatus && matchDateRange;
  });

  // Sorting logic
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sort) {
      case 'Urutan Terbaru':
        return b.timestamp - a.timestamp;
      case 'Urutan Terlama':
        return a.timestamp - b.timestamp;
      case 'A - Z':
        return a.title.localeCompare(b.title, 'id-ID');
      case 'Z - A':
        return b.title.localeCompare(a.title, 'id-ID');
      default:
        return 0;
    }
  });

  // Pagination logic
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = sortedArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Calculate stats dinamis
  const totalArtikel = articles.length;
  const berhasilPublish = articles.filter((a) => a.status === 'Berhasil Publish').length;
  const gagalPublish = articles.filter((a) => a.status === 'Gagal Publish').length;
  const draft = articles.filter((a) => a.status === 'Draft').length;

  // Helper function untuk format tanggal
  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) {
      const today = new Date();
      const formatter = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      return formatter.format(today);
    }
    const formatter = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    return `${formatter.format(dateRange.from)} - ${formatter.format(dateRange.to)}`;
  };

  const TABLE_ROW_HEIGHT = 72;
  const MAX_VISIBLE_ROWS = 5;
  const tableMaxHeight = TABLE_ROW_HEIGHT * MAX_VISIBLE_ROWS;

  // Simple Calendar Component
  const SimpleCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // Mei 2026
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    const handleDateClick = (date: Date | null) => {
      if (!date) return;
      if (!dateRange.from) {
        setDateRange({ from: date, to: null });
      } else if (!dateRange.to) {
        if (date < dateRange.from) {
          setDateRange({ from: date, to: dateRange.from });
        } else {
          setDateRange({ from: dateRange.from, to: date });
        }
      } else {
        setDateRange({ from: date, to: null });
      }
    };

    const isBetween = (date: Date) => {
      if (!dateRange.from || !dateRange.to) return false;
      const dateTime = date.getTime();
      const fromTime = dateRange.from.getTime();
      const toTime = dateRange.to.getTime();
      return dateTime >= fromTime && dateTime <= toTime;
    };

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-semibold text-gray-800">{currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!date}
              className={`p-2 text-xs rounded ${
                !date
                  ? 'text-gray-200'
                  : dateRange.from?.toDateString() === date?.toDateString()
                    ? 'bg-blue-500 text-white font-semibold'
                    : dateRange.to?.toDateString() === date?.toDateString()
                      ? 'bg-blue-500 text-white font-semibold'
                      : isBetween(date)
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => setDateRange({ from: null, to: null })} className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
            Reset
          </button>
          <button onClick={() => setIsCalendarOpen(false)} className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors">
            Terapkan
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-18' : 'ml-64'}`}>
      <div className="min-h-screen bg-[#f0f4fb] p-3 sm:p-4 md:p-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Artikel</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kelola Seluruh Artikel</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-primary text-white rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition-colors cursor-pointer">
              <Upload size={15} />
              Upload Artikel
            </button>
            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                <Calendar size={14} className="text-blue-500" />
                <span className="hidden sm:inline">{formatDateRange()}</span>
                <span className="sm:hidden">{dateRange.from ? dateRange.from.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                <ChevronDown size={14} />
              </button>
              {isCalendarOpen && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <SimpleCalendar />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard label="Total Artikel" count={totalArtikel} unit="Artikel" icon={<Users size={18} />} bg="bg-green-500" textColor="text-green-500" />
          <StatCard label="Berhasil Publish" count={berhasilPublish} unit="Artikel" icon={<Stethoscope size={18} />} bg="bg-blue-500" textColor="text-blue-500" />
          <StatCard label="Gagal Publish" count={gagalPublish} unit="Artikel" icon={<ClipboardList size={18} />} bg="bg-orange-400" textColor="text-orange-400" />
          <StatCard label="Draft" count={draft} unit="Artikel" icon={<FileText size={18} />} bg="" textColor="text-blue-500" border />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-100 mb-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0 ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul artikel, atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
              />
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Select options={kategoriOptions} value={kategori} onChange={setKategori} />
              <Select options={statusOptions} value={status} onChange={setStatus} />
              <button
                onClick={() => {
                  setSearch('');
                  setKategori('Semua Kategori');
                  setStatus('Semua Status');
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
            <div className="sm:ml-auto">
              <Select options={sortOptions} value={sort} onChange={setSort} />
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader size={24} className="animate-spin text-blue-500" />
              </div>
            ) : sortedArticles.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">Tidak ada artikel ditemukan.</p>
            ) : (
              paginatedArticles.map((a) => <MobileArticleCard key={a.id} article={a} />)
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2">
              <span>Judul Artikel</span>
              <span>Kategori</span>
              <span>Tanggal</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>
            <div className="overflow-y-auto divide-y divide-gray-50" style={{ maxHeight: `${tableMaxHeight}px` }}>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader size={24} className="animate-spin text-blue-500" />
                </div>
              ) : sortedArticles.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-10">Tidak ada artikel ditemukan.</p>
              ) : (
                paginatedArticles.map((article) => (
                  <div key={article.id}>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 pr-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={article.image} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shrink-0" />
                        <span className="font-medium text-gray-800 text-sm line-clamp-2 leading-snug">{article.title}</span>
                      </div>
                      <div className="pr-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${article.categoryColor}`}>{article.category}</span>
                      </div>
                      <div className="text-xs text-gray-500 pr-2">
                        <div>{article.date}</div>
                        <div className="text-gray-400">{article.time}</div>
                      </div>
                      <div className="pr-2">
                        <StatusBadge status={article.status} />
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
                          <Eye size={13} /> Lihat
                        </button>
                        <button className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
                          <Pencil size={13} /> Edit
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </div>
                    {article.errorReason && (
                      <div className="bg-red-50 px-4 pb-2 -mt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <p className="text-xs text-red-400">{article.errorReason}</p>
                          <button className="text-xs text-orange-500 hover:text-orange-700 font-semibold flex items-center gap-1 whitespace-nowrap">
                            <RefreshCw size={12} /> Coba Publish Ulang
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col xs:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 whitespace-nowrap">
              Menampilkan {sortedArticles.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedArticles.length)} dari {sortedArticles.length} artikel
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${currentPage === p ? 'bg-blue-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && (
                <>
                  <span className="text-gray-400 text-xs px-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ← MODAL DI SINI */}
      <ModalUploadArtikel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          console.log('Artikel berhasil disimpan!');
          fetchArticles(); // Refresh data
        }}
      />
    </div>
  );
}
