'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Camera, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/customeToast/CustomeToast';

interface EditIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditIdentityModal({ isOpen, onClose, onSaved }: EditIdentityModalProps) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    age: '',
    height: '',
    weight: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [avatarLetter, setAvatarLetter] = useState('U');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data user saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const uid = session.user.id;
      setUserId(uid);

      const [{ data: userData }, { data: profileData }] = await Promise.all([
        supabase.from('users').select('full_name, email').eq('id', uid).single(),
        supabase.from('user_profiles').select('height_cm, weight_kg, age, photo_url').eq('user_id', uid).single(),
      ]);

      const name = userData?.full_name ?? session.user.email?.split('@')[0] ?? 'User';
      setAvatarLetter(name.charAt(0).toUpperCase());

      setForm({
        fullName: name,
        email: userData?.email ?? session.user.email ?? '',
        age: profileData?.age ? String(profileData.age) : '',
        height: profileData?.height_cm ? String(profileData.height_cm) : '',
        weight: profileData?.weight_kg ? String(profileData.weight_kg) : '',
      });

      if (profileData?.photo_url) {
        setPhotoPreview(profileData.photo_url);
      }
    };

    fetchData();
  }, [isOpen]);

  // Handler foto
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showErrorToast({ title: 'Format Salah', message: 'File harus berupa gambar (JPG, PNG).' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showErrorToast({ title: 'File Terlalu Besar', message: 'Ukuran foto maksimal 2MB.' });
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setAvatarLetter(''); // sembunyikan huruf saat ada foto
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      showErrorToast({ title: 'Gagal', message: 'Nama lengkap tidak boleh kosong.' });
      return;
    }
    if (!userId) {
      console.log('❌ userId null!');
      return;
    }

    setLoading(true);
    try {
      console.log('▶ userId:', userId);
      console.log('▶ form:', form);

      // Update nama
      const { error: userErr } = await supabase.from('users').update({ full_name: form.fullName.trim(), updated_at: new Date().toISOString() }).eq('id', userId);

      console.log('▶ update users error:', userErr);
      if (userErr) throw new Error('Update nama gagal: ' + userErr.message);

      // Upload foto jika ada file baru
      let photoUrl: string | null = null;
      if (photoFile) {
        console.log('▶ uploading photo file:', photoFile.name);

        // Hapus file lama jika ada
        const { data: oldProfile } = await supabase.from('user_profiles').select('photo_url').eq('user_id', userId).single();

        if (oldProfile?.photo_url) {
          const oldPath = oldProfile.photo_url.split('/').pop();
          if (oldPath) {
            await supabase.storage.from('user-photo').remove([`${userId}/${oldPath}`]);
          }
        }

        // Upload foto baru
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadErr, data } = await supabase.storage.from('user-photo').upload(filePath, photoFile, { upsert: true });

        console.log('▶ upload error:', uploadErr);
        if (uploadErr) throw new Error('Upload foto gagal: ' + uploadErr.message);

        // Dapatkan public URL
        const { data: publicUrlData } = supabase.storage.from('user-photo').getPublicUrl(filePath);

        photoUrl = publicUrlData?.publicUrl || null;
        console.log('▶ photoUrl:', photoUrl);
      }

      // Upsert profile (dengan photo_url jika ada)
      const upsertData: any = {
        user_id: userId,
        height_cm: form.height ? parseInt(form.height) : null,
        weight_kg: form.weight ? parseInt(form.weight) : null,
        age: form.age ? parseInt(form.age) : null,
      };

      if (photoUrl) {
        upsertData.photo_url = photoUrl;
      }

      console.log('▶ upsert data:', upsertData);

      const { error: profileErr } = await supabase.from('user_profiles').upsert(upsertData, { onConflict: 'user_id' });

      console.log('▶ upsert profile error:', profileErr);
      if (profileErr) throw new Error('Upsert profil gagal: ' + profileErr.message);

      showSuccessToast({ title: 'Profil Diperbarui!', message: 'Data berhasil disimpan.' });
      onSaved(); // ← ini trigger fetchProfile di parent
      onClose();
    } catch (err: any) {
      console.log('❌ CATCH ERROR:', err);
      showErrorToast({ title: 'Gagal Menyimpan', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setPhotoFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="text-sm font-black text-gray-800 tracking-widest uppercase">Edit Identity</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div onClick={() => fileInputRef.current?.click()} className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center cursor-pointer group overflow-hidden">
              {photoPreview ? <img src={photoPreview} alt="foto" className="w-full h-full object-cover" /> : <span className="text-3xl font-black text-green-600">{avatarLetter}</span>}
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <Camera size={20} className="text-white" />
              </div>
              {/* Camera badge */}
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-green-400 rounded-full flex items-center justify-center shadow-sm">
                <Camera size={12} className="text-green-600" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Tap to update visual id</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Masukkan nama lengkap"
              className="w-full border-2 border-green-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          {/* Age & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Enter your age"
                min="1"
                max="120"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Email</label>
              <input type="email" value={form.email} readOnly className="w-full border-2 border-green-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 outline-none bg-green-50 cursor-not-allowed truncate" />
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Height (CM)</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  placeholder="0"
                  min="0"
                  max="300"
                  className="w-full border-2 border-green-300 rounded-xl px-4 py-3 pr-12 text-sm font-medium text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">cm</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-1.5">Weight (KG)</label>
              <div className="relative">
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="0"
                  min="0"
                  max="500"
                  className="w-full border-2 border-green-300 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">kg</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button onClick={handleClose} disabled={loading} className="flex-1 py-3 text-sm font-bold text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-widest disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-green-200"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
