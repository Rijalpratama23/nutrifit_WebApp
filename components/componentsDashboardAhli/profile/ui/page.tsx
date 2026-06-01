'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { supabase } from '@/utils/supabase/client';
import { Settings, LogOut, ChevronLeft, ChevronRight, ChevronDown, Plus, Trash2, Loader2, BadgeCheck, X, Camera, Save } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';

// ─── Types ───────────────────────────────────────────────────
interface AhliProfile {
  id: string;
  specialization: string;
  experience_years: number;
  description: string;
  profile_photo_url: string | null;
  is_verified: boolean;
}
interface Experience {
  id: string;
  ahli_id: string;
  tahun_mulai: string;
  tahun_selesai: string;
  judul: string;
  tempat: string;
  deskripsi?: string;
  masih_bekerja?: boolean;
}
interface Education {
  id: string;
  ahli_id: string;
  tahun_mulai: string;
  tahun_selesai: string;
  judul: string;
  institusi: string;
  jenjang?: string;
  gelar?: string;
}
interface Konsultasi {
  id: string;
  created_at: string;
  status: string;
  user_id: string;
}
type TabType = 'Selesai' | 'Dibatalkan';

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const JENJANG_OPTIONS = ['D3', 'D4', 'S1', 'S2', 'S3', 'Profesi', 'Spesialis', 'Lainnya'];

function formatDate(d: string) {
  const dt = new Date(d);
  return `${dt.getDate()} ${BULAN[dt.getMonth()]} ${dt.getFullYear()}`;
}

// ─── Modal Edit Identitas ─────────────────────────────────────
function ModalEditIdentitas({
  userId,
  ahliProfileId,
  currentName,
  currentEmail,
  currentSpecialization,
  currentPhotoUrl,
  currentExperienceYears,
  onClose,
  onSaved,
}: {
  userId: string;
  ahliProfileId: string | null;
  currentName: string;
  currentEmail: string;
  currentSpecialization: string;
  currentPhotoUrl: string | null;
  currentExperienceYears: number;
  onClose: () => void;
  onSaved: (data: { name: string; email: string; specialization: string; photoUrl: string | null; experienceYears: number }) => void;
}) {
  const [form, setForm] = useState({
    nama: currentName,
    email: currentEmail,
    specialization: currentSpecialization,
    experience_years: String(currentExperienceYears),
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentPhotoUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran foto maksimal 2MB.');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSave = async () => {
    if (!form.nama.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let photoUrl = currentPhotoUrl;
      if (photoFile) {
        const fileName = `ahli-${userId}-${Date.now()}.${photoFile.name.split('.').pop()}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage.from('profile-photos').upload(fileName, photoFile, { upsert: true });
        if (uploadErr) throw new Error('Gagal upload foto: ' + uploadErr.message);
        const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(uploadData.path);
        photoUrl = urlData.publicUrl;
      }
      const { error: userErr } = await supabase.from('users').update({ full_name: form.nama.trim() }).eq('id', userId);
      if (userErr) throw new Error('Gagal update nama: ' + userErr.message);
      if (ahliProfileId) {
        const { error: profileErr } = await supabase
          .from('ahli_profiles')
          .update({
            specialization: form.specialization.trim(),
            profile_photo_url: photoUrl,
            experience_years: parseInt(form.experience_years) || 0,
          })
          .eq('id', ahliProfileId);
        if (profileErr) throw new Error('Gagal update profil: ' + profileErr.message);
      }
      onSaved({ name: form.nama.trim(), email: form.email, specialization: form.specialization.trim(), photoUrl, experienceYears: parseInt(form.experience_years) || 0 });
      showSuccessToast({ title: 'Profil Diperbarui!', message: 'Perubahan identitas berhasil disimpan.' });
      onClose();
    } catch (err: any) {
      setError(err.message);
      showErrorToast({ title: 'Gagal Menyimpan', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer">
            <Settings size={16} className="text-blue-500 cursor-pointer" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Edit Identitas</h2>
            <p className="text-[11px] text-gray-400">Perubahan tersimpan otomatis ke profil</p>
          </div>
          <button onClick={!loading ? onClose : undefined} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex flex-col items-center gap-2">
            <div onClick={() => fileInputRef.current?.click()} className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200 bg-gray-100 cursor-pointer group">
              {photoPreview ? (
                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  <circle cx="50" cy="50" r="50" fill="#e5e7eb" />
                  <circle cx="50" cy="38" r="18" fill="#9ca3af" />
                  <ellipse cx="50" cy="85" rx="28" ry="20" fill="#9ca3af" />
                </svg>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <p className="text-[11px] text-gray-400">Klik foto untuk mengganti</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Dr. Nama Lengkap"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Email</label>
            <input value={form.email} readOnly className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-[10px] text-gray-400 mt-0.5">Email tidak dapat diubah</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Spesialis</label>
              <input
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                placeholder="Gizi"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Pengalaman (thn)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                placeholder="5"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-6 pb-5">
          <button onClick={!loading ? onClose : undefined} disabled={loading} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSave} disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Experience ─────────────────────────────────────────
function ModalExperience({ ahliId, onClose, onSaved }: { ahliId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ judul: '', tempat: '', tahun_mulai: '', tahun_selesai: '', deskripsi: '', masih_bekerja: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.judul || !form.tempat || !form.tahun_mulai) {
      setError('Jabatan, nama tempat, dan periode mulai wajib diisi.');
      return;
    }
    if (!form.masih_bekerja && !form.tahun_selesai) {
      setError('Periode selesai wajib diisi jika tidak sedang bekerja di sini.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.from('ahli_experience').insert({
      ahli_id: ahliId,
      judul: form.judul,
      tempat: form.tempat,
      tahun_mulai: form.tahun_mulai,
      tahun_selesai: form.masih_bekerja ? 'Sekarang' : form.tahun_selesai,
      deskripsi: form.deskripsi || null,
      masih_bekerja: form.masih_bekerja,
    });
    setLoading(false);
    if (err) {
      setError('Gagal menyimpan: ' + err.message);
      showErrorToast({ title: 'Gagal Menyimpan', message: err.message });
      return;
    }
    showSuccessToast({ title: 'Pengalaman Ditambahkan!', message: 'Data pengalaman berhasil disimpan.' });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Tambah & Edit Pengalaman</h2>
            <p className="text-[11px] text-gray-400">Isi detail pengalaman profesional anda</p>
          </div>
          <button onClick={!loading ? onClose : undefined} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={15} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Jabatan/posisi <span className="text-red-500">*</span>
            </label>
            <input
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              maxLength={100}
              placeholder="Contoh: Ahli Gizi, Nutritionist"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <p className="text-right text-[10px] text-gray-400 mt-0.5">{form.judul.length}/100</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Nama Rumah Sakit/Klinik <span className="text-red-500">*</span>
            </label>
            <input
              value={form.tempat}
              onChange={(e) => setForm({ ...form, tempat: e.target.value })}
              maxLength={100}
              placeholder="Contoh: Rumah sakit sehat, klinik Nutrifit"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <p className="text-right text-[10px] text-gray-400 mt-0.5">{form.tempat.length}/100</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Periode Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={form.tahun_mulai}
                onChange={(e) => setForm({ ...form, tahun_mulai: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Periode Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={form.tahun_selesai}
                onChange={(e) => setForm({ ...form, tahun_selesai: e.target.value })}
                disabled={form.masih_bekerja}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.masih_bekerja} onChange={(e) => setForm({ ...form, masih_bekerja: e.target.checked, tahun_selesai: e.target.checked ? '' : form.tahun_selesai })} className="accent-blue-500 w-4 h-4" />
            <span className="text-sm text-gray-600">Masih Bekerja disini</span>
          </label>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              maxLength={300}
              rows={4}
              placeholder="Jelaskan tugas dan tanggung jawab anda di posisi ini..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            />
            <p className="text-right text-[10px] text-gray-400 mt-0.5">{form.deskripsi.length}/300</p>
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={!loading ? onClose : undefined} disabled={loading} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Education ──────────────────────────────────────────
function ModalEducation({ ahliId, onClose, onSaved }: { ahliId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ jenjang: '', institusi: '', judul: '', tahun_mulai: '', tahun_selesai: '', gelar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.jenjang || !form.institusi || !form.judul || !form.tahun_mulai || !form.tahun_selesai) {
      setError('Semua field wajib diisi.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.from('ahli_education').insert({
      ahli_id: ahliId,
      jenjang: form.jenjang,
      institusi: form.institusi,
      judul: form.judul,
      tahun_mulai: form.tahun_mulai,
      tahun_selesai: form.tahun_selesai,
      gelar: form.gelar || null,
    });
    setLoading(false);
    if (err) {
      setError('Gagal menyimpan: ' + err.message);
      showErrorToast({ title: 'Gagal Menyimpan', message: err.message });
      return;
    }
    showSuccessToast({ title: 'Pendidikan Ditambahkan!', message: 'Data pendidikan berhasil disimpan.' });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Tambah Pendidikan</h2>
            <p className="text-[11px] text-gray-400">Tambah riwayat pendidikan terakhir anda</p>
          </div>
          <button onClick={!loading ? onClose : undefined} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={15} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Jenjang Pendidikan <span className="text-red-500">*</span>
            </label>
            <select
              value={form.jenjang}
              onChange={(e) => setForm({ ...form, jenjang: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-700"
            >
              <option value="">Pilih jenjang</option>
              {JENJANG_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Nama Universitas/Sekolah <span className="text-red-500">*</span>
            </label>
            <input
              value={form.institusi}
              onChange={(e) => setForm({ ...form, institusi: e.target.value })}
              placeholder="Contoh: Universitas Nusa Putra"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Program Studi <span className="text-red-500">*</span>
            </label>
            <input
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              placeholder="Contoh: Ilmu Gizi"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Periode Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={form.tahun_mulai}
                onChange={(e) => setForm({ ...form, tahun_mulai: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Tahun Lulus <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={form.tahun_selesai}
                onChange={(e) => setForm({ ...form, tahun_selesai: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Gelar</label>
            <input
              value={form.gelar}
              onChange={(e) => setForm({ ...form, gelar: e.target.value })}
              placeholder="Contoh: S.Gz"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={!loading ? onClose : undefined} disabled={loading} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ContainerProfile() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('Ahli');
  const [userEmail, setUserEmail] = useState('');
  const [ahliProfile, setAhliProfile] = useState<AhliProfile | null>(null);
  const [ahliProfileId, setAhliProfileId] = useState<string | null>(null);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [konsultasiSelesai, setKonsultasiSelesai] = useState<Konsultasi[]>([]);
  const [konsultasiBatal, setKonsultasiBatal] = useState<Konsultasi[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>('Selesai');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const [{ data: userData }, { data: profileData }] = await Promise.all([supabase.from('users').select('full_name, email').eq('id', user.id).single(), supabase.from('ahli_profiles').select('*').eq('user_id', user.id).maybeSingle()]);

      setUserName(userData?.full_name ?? user.email ?? 'Ahli');
      setUserEmail(userData?.email ?? user.email ?? '');
      setAhliProfile(profileData ?? null);

      const profileId = profileData?.id ?? null;
      setAhliProfileId(profileId);

      if (profileId) {
        const [{ data: exp }, { data: edu }, { data: selesai }, { data: batal }] = await Promise.all([
          supabase.from('ahli_experience').select('*').eq('ahli_id', profileId).order('tahun_mulai', { ascending: true }),
          supabase.from('ahli_education').select('*').eq('ahli_id', profileId).order('tahun_mulai', { ascending: true }),
          supabase.from('consultations').select('id, created_at, status, user_id').eq('ahli_id', user.id).eq('status', 'completed').order('created_at', { ascending: false }),
          supabase.from('consultations').select('id, created_at, status, user_id').eq('ahli_id', user.id).eq('status', 'cancelled').order('created_at', { ascending: false }),
        ]);
        setExperience(exp ?? []);
        setEducation(edu ?? []);
        setKonsultasiSelesai(selesai ?? []);
        setKonsultasiBatal(batal ?? []);
      }
      setPageLoading(false);
    };

    fetchAll();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const refetchExperience = async () => {
    if (!ahliProfileId) return;
    const { data } = await supabase.from('ahli_experience').select('*').eq('ahli_id', ahliProfileId).order('tahun_mulai', { ascending: true });
    if (data) setExperience(data);
  };

  const refetchEducation = async () => {
    if (!ahliProfileId) return;
    const { data } = await supabase.from('ahli_education').select('*').eq('ahli_id', ahliProfileId).order('tahun_mulai', { ascending: true });
    if (data) setEducation(data);
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from('ahli_experience').delete().eq('id', id);
    if (error) {
      showErrorToast({ title: 'Gagal Hapus', message: 'Gagal menghapus pengalaman.' });
    } else {
      showSuccessToast({ title: 'Dihapus!', message: 'Pengalaman berhasil dihapus.' });
      refetchExperience();
    }
  };

  const deleteEducation = async (id: string) => {
    const { error } = await supabase.from('ahli_education').delete().eq('id', id);
    if (error) {
      showErrorToast({ title: 'Gagal Hapus', message: 'Gagal menghapus pendidikan.' });
    } else {
      showSuccessToast({ title: 'Dihapus!', message: 'Pendidikan berhasil dihapus.' });
      refetchEducation();
    }
  };

  useEffect(() => {
    if (!ahliProfileId) return;
    const channel = supabase
      .channel('profile-ahli-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ahli_experience', filter: `ahli_id=eq.${ahliProfileId}` }, refetchExperience)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ahli_education', filter: `ahli_id=eq.${ahliProfileId}` }, refetchEducation)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [ahliProfileId]);

  const handleEditSaved = (data: { name: string; email: string; specialization: string; photoUrl: string | null; experienceYears: number }) => {
    setUserName(data.name);
    setAhliProfile((prev) => (prev ? { ...prev, specialization: data.specialization, profile_photo_url: data.photoUrl, experience_years: data.experienceYears } : prev));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showSuccessToast({ title: 'Keluar Berhasil', message: 'Sampai jumpa kembali!' });
    router.push('/login');
  };

  const filtered = activeTab === 'Selesai' ? konsultasiSelesai : konsultasiBatal;
  const totalPages = filtered.length;
  const visibleItem = filtered[page] ?? null;

  function handleTabChange(tab: TabType) {
    setActiveTab(tab);
    setPage(0);
    setDropdownOpen(false);
  }

  if (pageLoading) {
    return (
      <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] flex items-center justify-center transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
          <div className="mt-8 sm:mt-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Profile</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola Profile Anda</p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 border border-gray-300 rounded-xl py-2 px-3 sm:px-5 font-semibold text-xs sm:text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm flex-shrink-0 cursor-pointer"
          >
            <Settings size={15} className="text-gray-700" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 sm:gap-5">
          {/* LEFT */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col items-center gap-3">
            <div onClick={() => setShowEditModal(true)} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 cursor-pointer group mt-2">
              {ahliProfile?.profile_photo_url ? (
                <img src={ahliProfile.profile_photo_url} alt="foto profil" className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  <circle cx="50" cy="50" r="50" fill="#e5e7eb" />
                  <circle cx="50" cy="38" r="18" fill="#9ca3af" />
                  <ellipse cx="50" cy="85" rx="28" ry="20" fill="#9ca3af" />
                </svg>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <p className="font-bold text-gray-800 text-sm sm:text-base">{userName}</p>
                {ahliProfile?.is_verified && <BadgeCheck size={16} className="text-blue-500" />}
              </div>
              <p className="text-gray-400 text-xs mt-0.5">{userEmail}</p>
            </div>
            <div className="w-full border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-500 font-medium">Spesialis</span>
                <span className="text-gray-800 font-semibold text-right truncate ml-2">{ahliProfile?.specialization ?? '-'}</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-500 font-medium">Pengalaman</span>
                <span className="text-gray-800 font-semibold">{ahliProfile?.experience_years ?? 0} thn</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-500 font-medium">Status</span>
                <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> ONLINE
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="mt-1 w-full flex items-center justify-center gap-2 border border-red-300 text-red-500 hover:bg-red-50 transition-colors rounded-xl py-2 text-sm font-medium">
              <LogOut size={14} /> Keluar
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Pengalaman */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-[15px]">Pengalaman Profesional</h2>
                  <button onClick={() => setShowExpModal(true)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Tambah">
                    <Plus size={14} className="text-blue-500" />
                  </button>
                </div>
                {experience.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Belum ada pengalaman. Klik + untuk menambahkan.</p>
                ) : (
                  <div className="space-y-3">
                    {experience.map((item) => (
                      <div key={item.id} className="flex gap-2.5 group">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-gray-400">
                            {item.tahun_mulai} – {item.tahun_selesai}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">{item.judul}</p>
                          <p className="text-[11px] sm:text-xs text-gray-500 truncate">{item.tempat}</p>
                        </div>
                        <button onClick={() => deleteExperience(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 flex-shrink-0">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pendidikan */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-[15px]">Pendidikan</h2>
                  <button onClick={() => setShowEduModal(true)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Tambah">
                    <Plus size={14} className="text-blue-500" />
                  </button>
                </div>
                {education.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Belum ada pendidikan. Klik + untuk menambahkan.</p>
                ) : (
                  <div className="space-y-3">
                    {education.map((item) => (
                      <div key={item.id} className="flex gap-2.5 group">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-gray-400">
                            {item.tahun_mulai} – {item.tahun_selesai}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                            {item.jenjang ? `${item.jenjang} - ` : ''}
                            {item.judul}
                          </p>
                          <p className="text-[11px] sm:text-xs text-gray-500 truncate">{item.institusi}</p>
                          {item.gelar && <p className="text-[10px] text-blue-500 font-medium">{item.gelar}</p>}
                        </div>
                        <button onClick={() => deleteEducation(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 flex-shrink-0">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Konsultasi */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 min-w-0">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen((o) => !o)} className="flex items-center gap-1">
                      <span className={`font-semibold text-sm sm:text-[15px] border-b-2 pb-0.5 whitespace-nowrap ${activeTab === 'Selesai' ? 'text-blue-600 border-blue-500' : 'text-red-500 border-red-400'}`}>Konsultasi {activeTab}</span>
                      <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${activeTab === 'Selesai' ? 'text-blue-500' : 'text-red-400'}`} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 w-[200px] flex flex-col gap-0.5">
                        <button
                          onClick={() => handleTabChange('Selesai')}
                          className={`flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm mx-1 rounded-lg transition-colors ${activeTab === 'Selesai' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Konsultasi Selesai
                          <span className={`ml-auto text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${activeTab === 'Selesai' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{konsultasiSelesai.length}</span>
                        </button>
                        <div className="mx-3 border-t border-gray-100" />
                        <button
                          onClick={() => handleTabChange('Dibatalkan')}
                          className={`flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm mx-1 rounded-lg transition-colors ${activeTab === 'Dibatalkan' ? 'bg-red-50 text-red-500 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          Konsultasi Batal
                          <span className={`ml-auto text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${activeTab === 'Dibatalkan' ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'}`}>{konsultasiBatal.length}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                      <ChevronLeft size={13} className="text-gray-500" />
                    </button>
                    <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                      <ChevronRight size={13} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs text-gray-400">{filtered.length === 0 ? '0 / 0' : `${page + 1} / ${totalPages}`}</span>
              </div>

              {visibleItem ? (
                <>
                  <div className="sm:hidden bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <div className={`h-1 w-full ${activeTab === 'Selesai' ? 'bg-blue-500' : 'bg-red-400'}`} />
                    <div className="p-4 space-y-2">
                      <p className="font-bold text-gray-800 text-sm">{formatDate(visibleItem.created_at)}</p>
                      <p className="text-gray-600 text-xs">ID: {visibleItem.id.slice(0, 16)}...</p>
                      <div className="flex items-center justify-between pt-1">
                        {activeTab === 'Selesai' ? (
                          <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">Selesai</span>
                        ) : (
                          <span className="bg-red-100 text-red-500 text-[10px] font-semibold px-2.5 py-1 rounded-full">Dibatalkan</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-stretch bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <div className={`w-1 flex-shrink-0 ${activeTab === 'Selesai' ? 'bg-blue-500' : 'bg-red-400'}`} />
                    <div className="px-4 lg:px-5 py-3.5 border-r border-gray-200 flex-shrink-0 flex items-center">
                      <p className="font-bold text-gray-800 text-sm whitespace-nowrap">{formatDate(visibleItem.created_at)}</p>
                    </div>
                    <div className="px-4 lg:px-5 py-3.5 flex-1 border-r border-gray-200 flex items-center min-w-0">
                      <p className="text-gray-600 text-xs lg:text-sm truncate">ID: {visibleItem.id}</p>
                    </div>
                    <div className="px-4 lg:px-5 py-3.5 flex-shrink-0 flex items-center">
                      {activeTab === 'Selesai' ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">Selesai</span>
                      ) : (
                        <span className="bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">Dibatalkan</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">Tidak ada data konsultasi {activeTab.toLowerCase()}.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && userId && (
        <ModalEditIdentitas
          userId={userId}
          ahliProfileId={ahliProfileId}
          currentName={userName}
          currentEmail={userEmail}
          currentSpecialization={ahliProfile?.specialization ?? ''}
          currentPhotoUrl={ahliProfile?.profile_photo_url ?? null}
          currentExperienceYears={ahliProfile?.experience_years ?? 0}
          onClose={() => setShowEditModal(false)}
          onSaved={handleEditSaved}
        />
      )}
      {showExpModal && ahliProfileId && <ModalExperience ahliId={ahliProfileId} onClose={() => setShowExpModal(false)} onSaved={refetchExperience} />}
      {showEduModal && ahliProfileId && <ModalEducation ahliId={ahliProfileId} onClose={() => setShowEduModal(false)} onSaved={refetchEducation} />}
    </div>
  );
}
