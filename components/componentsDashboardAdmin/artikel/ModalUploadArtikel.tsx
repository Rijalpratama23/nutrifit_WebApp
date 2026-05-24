'use client';

import { useState } from 'react';
import { X, Upload, Loader2, Bold, Italic, Underline, List, AlignLeft, Link, User, ChevronDown } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

interface ModalUploadArtikelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const kategoriOptions = ['Pilih kategori artikel', 'Gaya Hidup Sehat', 'Diet & Nutrisi', 'Kesehatan Fisik'];

export default function ModalUploadArtikel({ isOpen, onClose, onSuccess }: ModalUploadArtikelProps) {
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    status: 'draft',
    scheduledAt: '',
    tags: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // ── Tiptap Editor ─────────────────────────────────────────────
  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension, LinkExtension.configure({ openOnClick: false }), TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: '',
    onUpdate: ({ editor }) => {
      // Sync konten editor ke form.content sebagai HTML
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'min-h-[150px] px-3 py-2 text-sm outline-none bg-white prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showErrorToast({ title: 'Format Salah', message: 'File harus berupa gambar.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showErrorToast({ title: 'File Terlalu Besar', message: 'Ukuran gambar maksimal 2MB.' });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Hitung word count dari plain text editor
  const wordCount = editor?.getText().trim().split(/\s+/).filter(Boolean).length ?? 0;

  const handleSubmit = async (submitStatus: 'draft' | 'published') => {
    const htmlContent = editor?.getHTML() ?? '';
    const plainText = editor?.getText().trim() ?? '';

    if (!form.title.trim()) {
      showErrorToast({ title: 'Judul Kosong', message: 'Judul artikel wajib diisi.' });
      return;
    }
    if (!plainText) {
      showErrorToast({ title: 'Konten Kosong', message: 'Isi artikel wajib diisi.' });
      return;
    }
    if (!form.category || form.category === 'Pilih kategori artikel') {
      showErrorToast({ title: 'Kategori Kosong', message: 'Kategori artikel wajib dipilih.' });
      return;
    }

    setLoading(true);
    try {
      let image_url = '';
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('artikel-images').upload(fileName, imageFile);
        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);
        const { data: urlData } = supabase.storage.from('artikel-images').getPublicUrl(uploadData.path);
        image_url = urlData.publicUrl;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: insertError } = await supabase.from('articles').insert({
        title: form.title.trim(),
        content: htmlContent, // ← simpan sebagai HTML dari Tiptap
        category: form.category,
        image_url: image_url || null,
        status: submitStatus,
        author_id: user?.id,
      });

      if (insertError) throw new Error('Gagal menyimpan artikel: ' + insertError.message);

      showSuccessToast({
        title: submitStatus === 'published' ? 'Artikel Dipublish!' : 'Draft Disimpan!',
        message: submitStatus === 'published' ? 'Artikel berhasil dipublish.' : 'Artikel disimpan sebagai draft.',
      });

      // Reset semua state + editor
      setForm({ title: '', summary: '', content: '', category: '', status: 'draft', scheduledAt: '', tags: '' });
      setImageFile(null);
      setImagePreview('');
      editor?.commands.clearContent();
      onSuccess();
      onClose();
    } catch (error: any) {
      showErrorToast({ title: 'Gagal', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setForm({ title: '', summary: '', content: '', category: '', status: 'draft', scheduledAt: '', tags: '' });
    setImageFile(null);
    setImagePreview('');
    editor?.commands.clearContent(); // reset editor saat tutup modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Upload size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Upload Artikel</h2>
            <p className="text-xs text-gray-400">Tambahkan artikel baru ke sistem Nutrifit</p>
          </div>
          <button onClick={handleClose} disabled={loading} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* ── Kolom Kiri ── */}
            <div className="flex-1 space-y-4 min-w-0">
              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="Masukkan judul artikel"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={150}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-right text-[10px] text-gray-400 mt-0.5">{form.title.length}/150</p>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-500 appearance-none cursor-pointer"
                  >
                    {kategoriOptions.map((k) => (
                      <option key={k} value={k === 'Pilih kategori artikel' ? '' : k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Ringkasan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ringkasan Singkat <span className="text-gray-400 font-normal text-[10px]">(opsional)</span>
                </label>
                <textarea
                  name="summary"
                  placeholder="Tulis ringkasan singkat artikel (opsional)"
                  value={form.summary}
                  onChange={handleChange}
                  maxLength={200}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
                <p className="text-right text-[10px] text-gray-400 mt-0.5">{form.summary.length}/200</p>
              </div>

              {/* ── Isi Artikel dengan Tiptap ── */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Isi Artikel <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  {/* Toolbar Tiptap — semua tombol terhubung ke editor */}
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100 flex-wrap">
                    {/* Heading dropdown */}
                    <div className="relative">
                      <select
                        className="text-xs text-gray-600 bg-transparent outline-none cursor-pointer appearance-none pr-4 font-medium"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'paragraph') {
                            editor?.chain().focus().setParagraph().run();
                          } else {
                            editor
                              ?.chain()
                              .focus()
                              .toggleHeading({ level: Number(val) as 1 | 2 | 3 })
                              .run();
                          }
                        }}
                      >
                        <option value="paragraph">Paragraf</option>
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="3">Heading 3</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    {/* Bold */}
                    <button
                      type="button"
                      title="Bold"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Bold size={13} />
                    </button>

                    {/* Italic */}
                    <button
                      type="button"
                      title="Italic"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Italic size={13} />
                    </button>

                    {/* Underline */}
                    <button
                      type="button"
                      title="Underline"
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Underline size={13} />
                    </button>

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    {/* Bullet List */}
                    <button
                      type="button"
                      title="Bullet List"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <List size={13} />
                    </button>

                    {/* Align Left */}
                    <button
                      type="button"
                      title="Align Left"
                      onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <AlignLeft size={13} />
                    </button>

                    {/* Link */}
                    <button
                      type="button"
                      title="Insert Link"
                      onClick={() => {
                        const url = prompt('Masukkan URL:');
                        if (url) editor?.chain().focus().setLink({ href: url }).run();
                      }}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('link') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Link size={13} />
                    </button>
                  </div>

                  {/* Editor area — menggantikan textarea */}
                  <EditorContent editor={editor} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{wordCount} Kata</p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tags / Keyword</label>
                <input
                  name="tags"
                  type="text"
                  placeholder="Contoh: diet sehat, protein, makanan sehat"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Pisahkan tag dengan koma</p>
              </div>
            </div>

            {/* ── Kolom Kanan ── */}
            <div className="md:w-52 flex-shrink-0 space-y-5">
              {/* Thumbnail */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Thumbnail</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 relative">
                  <div className="flex items-start gap-2">
                    <label className="flex flex-col items-center justify-center w-20 h-20 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors flex-shrink-0 group">
                      <Upload size={18} className="text-blue-400 mb-1" />
                      <p className="text-[9px] text-blue-400 font-medium text-center leading-tight">Upload Gambar</p>
                      <p className="text-[8px] text-gray-400 text-center">JPG, PNG (Max. 2MB)</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <div className="relative flex-1">
                        <img src={imagePreview} alt="preview" className="w-full h-20 object-cover rounded-lg" />
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 shadow-sm hover:bg-red-50"
                        >
                          <X size={11} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Artikel */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Status Artikel <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2.5">
                  {[
                    { value: 'draft', label: 'Draft', desc: 'Simpan sebagai draft' },
                    { value: 'published', label: 'Publish Sekarang', desc: 'Publikasikan artikel sekarang' },
                    { value: 'scheduled', label: 'Jadwalkan', desc: 'Pilih tanggal dan waktu publikasi' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
                      <input type="radio" name="status" value={opt.value} checked={form.status === opt.value} onChange={handleChange} className="mt-0.5 accent-blue-500" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700 leading-tight">{opt.label}</p>
                        <p className="text-[10px] text-gray-400">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {form.status === 'scheduled' && (
                  <div className="mt-2">
                    <input
                      type="datetime-local"
                      name="scheduledAt"
                      value={form.scheduledAt}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-400 bg-white text-gray-500"
                    />
                  </div>
                )}
              </div>

              {/* Penulis */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Penulis</label>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Admin Nutrifit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={handleClose} disabled={loading} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              Simpan Draft
            </button>
            <button
              onClick={() => handleSubmit(form.status === 'published' ? 'published' : 'draft')}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              Publish Artikel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
