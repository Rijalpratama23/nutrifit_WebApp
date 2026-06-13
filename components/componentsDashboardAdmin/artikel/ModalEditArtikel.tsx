'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Bold, Italic, Underline, List, AlignLeft, Link, User, ChevronDown, Pencil } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

interface EditArticle {
  id: string;
  title: string;
  image: string;
  category: string;
  status: string;
  content?: string;
}

interface ModalEditArtikelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  article: EditArticle | null;
}

const kategoriOptions = ['Pilih kategori artikel', 'Gaya Hidup Sehat', 'Diet & Nutrisi', 'Kesehatan Fisik'];

export default function ModalEditArtikel({ isOpen, onClose, onSuccess, article }: ModalEditArtikelProps) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    status: 'draft',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension, LinkExtension.configure({ openOnClick: false }), TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[150px] px-3 py-2 text-sm outline-none bg-white prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  // Pre-fill form when article changes
  useEffect(() => {
    if (article && isOpen) {
      setForm({
        title: article.title,
        category: article.category,
        status: article.status === 'Berhasil Publish' ? 'published' : article.status === 'Archived' ? 'archived' : 'draft',
      });
      setImagePreview(article.image && !article.image.includes('placehold') ? article.image : '');
      setImageFile(null);

      // Set editor content after mount
      if (editor && article.content) {
        setTimeout(() => {
          editor.commands.setContent(article.content ?? '');
        }, 50);
      }
    }
  }, [article, isOpen, editor]);

  const wordCount = editor?.getText().trim().split(/\s+/).filter(Boolean).length ?? 0;

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

  const handleSubmit = async () => {
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
      let image_url: string | undefined = undefined;

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('artikel-images').upload(fileName, imageFile);
        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);
        const { data: urlData } = supabase.storage.from('artikel-images').getPublicUrl(uploadData.path);
        image_url = urlData.publicUrl;
      }

      const updatePayload: Record<string, unknown> = {
        title: form.title.trim(),
        content: htmlContent,
        category: form.category,
        status: form.status,
        updated_at: new Date().toISOString(),
      };
      if (image_url) updatePayload.image_url = image_url;

      const { error } = await supabase.from('articles').update(updatePayload).eq('id', article!.id);
      if (error) throw new Error('Gagal menyimpan perubahan: ' + error.message);

      showSuccessToast({ title: 'Artikel Diperbarui!', message: 'Perubahan berhasil disimpan.' });
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan.';
      showErrorToast({ title: 'Gagal', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setForm({ title: '', category: '', status: 'draft' });
    setImageFile(null);
    setImagePreview('');
    editor?.commands.clearContent();
    onClose();
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Pencil size={18} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Edit Artikel</h2>
            <p className="text-xs text-gray-400">Perbarui konten artikel yang sudah ada</p>
          </div>
          <button onClick={handleClose} disabled={loading} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Kolom Kiri */}
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-700 appearance-none cursor-pointer"
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

              {/* Isi Artikel */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Isi Artikel <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100 flex-wrap">
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
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Bold size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Italic size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Underline size={13} />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <List size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <AlignLeft size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Masukkan URL:');
                        if (url) editor?.chain().focus().setLink({ href: url }).run();
                      }}
                      className={`p-1.5 rounded transition-colors ${editor?.isActive('link') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Link size={13} />
                    </button>
                  </div>
                  <EditorContent editor={editor} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{wordCount} Kata</p>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="md:w-52 flex-shrink-0 space-y-5">
              {/* Thumbnail */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Thumbnail</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <label className="flex flex-col items-center justify-center w-20 h-20 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors flex-shrink-0">
                      <Upload size={18} className="text-blue-400 mb-1" />
                      <p className="text-[9px] text-blue-400 font-medium text-center leading-tight">Ganti Gambar</p>
                      <p className="text-[8px] text-gray-400 text-center">JPG, PNG (Max. 2MB)</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <div className="relative flex-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Status Artikel <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2.5">
                  {[
                    { value: 'draft', label: 'Draft', desc: 'Simpan sebagai draft' },
                    { value: 'published', label: 'Publish Sekarang', desc: 'Publikasikan artikel sekarang' },
                    { value: 'archived', label: 'Arsipkan', desc: 'Pindahkan ke arsip' },
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

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={handleClose} disabled={loading} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Pencil size={13} />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
