'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { supabase } from '@/utils/supabase/client';
import { Users, UserPlus, UserCheck, Activity, Calendar, ChevronDown, ChevronUp, Trash2, ShieldOff, ShieldCheck, UserCog, X, AlertTriangle, CheckCircle, XCircle, Search, Loader, MoreVertical, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────
interface Props {
  totalPengguna: number;
  penggunaBaru: number;
  penggunaAktif: number;
  rataRataAktivitas: number;
  persenBaru: number;
  persenAktif: number;
}

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

type ToastVariant = 'confirm-delete' | 'confirm-suspend' | 'success' | 'error';

interface ToastState {
  open: boolean;
  variant: ToastVariant;
  title: string;
  message: string;
  targetId?: string;
  targetName?: string;
  targetRole?: string;
}

// ─── Helpers ──────────────────────────────────────────────────
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatTanggal(date: Date) {
  return `${HARI[date.getDay()]}, ${date.getDate()} - ${BULAN[date.getMonth()]} - ${date.getFullYear()}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

function ProgressBar({ persen, barColor }: { persen: number; barColor: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[60px] sm:min-w-[80px]">
        <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${Math.min(persen, 100)}%` }} />
      </div>
      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">{persen}%</span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    user: 'bg-blue-100 text-blue-600 border border-blue-200',
    ahli: 'bg-green-100 text-green-600 border border-green-200',
    admin: 'bg-purple-100 text-purple-600 border border-purple-200',
    suspended: 'bg-red-100 text-red-500 border border-red-200',
  };
  const label: Record<string, string> = {
    user: 'User',
    ahli: 'Ahli',
    admin: 'Admin',
    suspended: 'Suspended',
  };
  return <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${map[role] ?? 'bg-gray-100 text-gray-500 border border-gray-200'}`}>{label[role] ?? role}</span>;
}

// ─── Action Toast ─────────────────────────────────────────────
function ActionToast({ toast, onConfirm, onClose }: { toast: ToastState; onConfirm: (id: string, extra?: string) => void; onClose: () => void }) {
  if (!toast.open) return null;
  const iconMap: Record<ToastVariant, React.ReactNode> = {
    'confirm-delete': <AlertTriangle size={20} className="text-red-500 shrink-0" />,
    'confirm-suspend': <AlertTriangle size={20} className="text-yellow-500 shrink-0" />,
    success: <CheckCircle size={20} className="text-green-500 shrink-0" />,
    error: <XCircle size={20} className="text-red-500 shrink-0" />,
  };
  const borderMap: Record<ToastVariant, string> = {
    'confirm-delete': 'border-red-200',
    'confirm-suspend': 'border-yellow-200',
    success: 'border-green-200',
    error: 'border-red-200',
  };
  const isConfirm = toast.variant === 'confirm-delete' || toast.variant === 'confirm-suspend';
  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`bg-white rounded-2xl shadow-2xl border ${borderMap[toast.variant]} p-4 w-80 max-w-[calc(100vw-3rem)]`}>
        <div className="flex items-start gap-3">
          {iconMap[toast.variant]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800">{toast.title}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast.message}</p>
            {isConfirm && toast.targetId && (
              <div className="flex gap-2 mt-3">
                <button onClick={onClose} className="flex-1 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button
                  onClick={() => onConfirm(toast.targetId!, toast.targetRole)}
                  className={`flex-1 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ${toast.variant === 'confirm-delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                >
                  {toast.variant === 'confirm-delete' ? 'Ya, Hapus' : 'Ya, Lanjutkan'}
                </button>
              </div>
            )}
          </div>
          {!isConfirm && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors shrink-0">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Portal Dropdown ──────────────────────────────────────────
interface DropdownPortalProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function DropdownPortal({ anchorRef, open, onClose, children }: DropdownPortalProps) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const dropdownWidth = 192; // w-48
    const dropdownHeight = 200; // perkiraan tinggi, akan disesuaikan dengan konten

    // Coba tampilkan di bawah
    let top = rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - dropdownWidth;

    // Jika tidak cukup ruang di bawah, tampilkan di atas
    if (rect.bottom + dropdownHeight > window.innerHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 4;
    }

    // Pastikan tidak keluar dari kiri/kanan layar
    if (left < 8) left = 8;
    if (left + dropdownWidth > window.innerWidth + window.scrollX - 8) {
      left = window.innerWidth + window.scrollX - dropdownWidth - 8;
    }

    setPos({ top, left });
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        width: '192px', // w-48
      }}
      className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {children}
    </div>,
    document.body,
  );
}

// ─── Dropdown Aksi ────────────────────────────────────────────
function UserActionDropdown({
  user,
  onDelete,
  onSuspend,
  onEditRole,
}: {
  user: UserRow;
  onDelete: (id: string, name: string) => void;
  onSuspend: (id: string, name: string, currentRole: string) => void;
  onEditRole: (user: UserRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isSuspended = user.role === 'suspended';

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <MoreVertical size={15} />
      </button>

      <DropdownPortal anchorRef={btnRef} open={open} onClose={close}>
        {/* Edit Role */}
        <button
          onClick={() => {
            close();
            onEditRole(user);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors text-left"
        >
          <UserCog size={14} />
          <span>Edit Role</span>
        </button>

        {/* Suspend / Unsuspend */}
        <button
          onClick={() => {
            close();
            onSuspend(user.id, user.full_name, user.role);
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors text-left ${isSuspended ? 'text-green-600 hover:bg-green-50' : 'text-yellow-600 hover:bg-yellow-50'}`}
        >
          {isSuspended ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
          <span>{isSuspended ? 'Aktifkan Akun' : 'Suspend Akun'}</span>
        </button>

        <div className="border-t border-gray-100" />

        {/* Hapus */}
        <button
          onClick={() => {
            close();
            onDelete(user.id, user.full_name);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
        >
          <Trash2 size={14} />
          <span>Hapus Akun</span>
        </button>
      </DropdownPortal>
    </>
  );
}

// ─── Modal Edit Role ──────────────────────────────────────────
function ModalEditRole({ user, onClose, onSave }: { user: UserRow | null; onClose: () => void; onSave: (id: string, newRole: string) => Promise<void> }) {
  const [selectedRole, setSelectedRole] = useState(user?.role ?? 'user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setSelectedRole(user.role);
  }, [user]);

  if (!user) return null;

  const roles = [
    { value: 'user', label: 'User', desc: 'Pengguna biasa aplikasi' },
    { value: 'ahli', label: 'Ahli', desc: 'Ahli gizi yang terdaftar' },
    { value: 'admin', label: 'Admin', desc: 'Administrator sistem' },
  ];

  const handleSave = async () => {
    setLoading(true);
    await onSave(user.id, selectedRole);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <UserCog size={16} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Edit Role</h2>
            <p className="text-xs text-gray-400 truncate max-w-[200px]">{user.full_name}</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={15} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          {roles.map((r) => (
            <label key={r.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${selectedRole === r.value ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <input type="radio" name="role" value={r.value} checked={selectedRole === r.value} onChange={() => setSelectedRole(r.value)} className="mt-0.5 accent-blue-500" />
              <div>
                <p className="text-sm font-semibold text-gray-700">{r.label}</p>
                <p className="text-xs text-gray-400">{r.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading || selectedRole === user.role}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader size={13} className="animate-spin" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ContainerTotalPengguna({ totalPengguna: initTotal, penggunaBaru: initBaru, penggunaAktif: initAktif, rataRataAktivitas: initRata, persenBaru: initPersenBaru, persenAktif: initPersenAktif }: Props) {
  const { isCollapsed, isMobile } = useSidebar();
  const [expanded, setExpanded] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [activeDate] = useState(new Date());
  const dateRef = useRef<HTMLDivElement>(null);

  // ── Stat state ────────────────────────────────────────────────
  const [totalPengguna, setTotalPengguna] = useState(initTotal);
  const [penggunaBaru, setPenggunaBaru] = useState(initBaru);
  const [penggunaAktif, setPenggunaAktif] = useState(initAktif);
  const [rataRata, setRataRata] = useState(initRata);
  const [persenBaru, setPersenBaru] = useState(initPersenBaru);
  const [persenAktif, setPersenAktif] = useState(initPersenAktif);

  // ── Users table state ─────────────────────────────────────────
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editRoleUser, setEditRoleUser] = useState<UserRow | null>(null);

  // ── Toast ─────────────────────────────────────────────────────
  const [toast, setToast] = useState<ToastState>({ open: false, variant: 'success', title: '', message: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (state: Omit<ToastState, 'open'>, autoDismiss = true) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ ...state, open: true });
    if (autoDismiss && state.variant !== 'confirm-delete' && state.variant !== 'confirm-suspend') {
      toastTimer.current = setTimeout(() => setToast((p) => ({ ...p, open: false })), 3500);
    }
  };
  const closeToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast((p) => ({ ...p, open: false }));
  };

  // ── Fetch stats ───────────────────────────────────────────────
  const refetchCounts = async () => {
    try {
      const res = await fetch('/api/total-pengguna');
      const data = await res.json();
      setTotalPengguna(data.totalPengguna);
      setPenggunaBaru(data.penggunaBaru);
      setPenggunaAktif(data.penggunaAktif);
      setRataRata(data.rataRataAktivitas);
      setPersenBaru(data.persenBaru);
      setPersenAktif(data.persenAktif);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Fetch users list ──────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users?role=user');
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // ── Supabase Realtime ─────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('total-pengguna-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        refetchCounts();
        fetchUsers();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleDeleteRequest = (id: string, name: string) => {
    showToast({ variant: 'confirm-delete', title: 'Hapus Akun?', message: `Akun "${name}" akan dihapus permanen dan tidak bisa dikembalikan.`, targetId: id, targetName: name }, false);
  };

  const handleDeleteConfirm = async (id: string) => {
    closeToast();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast({ variant: 'success', title: 'Akun Dihapus', message: 'Akun berhasil dihapus dari sistem.' });
      refetchCounts();
    } catch (err: unknown) {
      showToast({ variant: 'error', title: 'Gagal Menghapus', message: err instanceof Error ? err.message : 'Terjadi kesalahan.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendRequest = (id: string, name: string, currentRole: string) => {
    const isSuspended = currentRole === 'suspended';
    showToast(
      {
        variant: 'confirm-suspend',
        title: isSuspended ? 'Aktifkan Akun?' : 'Suspend Akun?',
        message: isSuspended ? `Akun "${name}" akan diaktifkan kembali sebagai user.` : `Akun "${name}" akan disuspend dan tidak bisa login.`,
        targetId: id,
        targetName: name,
        targetRole: currentRole,
      },
      false,
    );
  };

  const handleSuspendConfirm = async (id: string, currentRole?: string) => {
    closeToast();
    setActionLoading(true);
    const newRole = currentRole === 'suspended' ? 'user' : 'suspended';
    try {
      const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role: newRole }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      showToast({ variant: 'success', title: newRole === 'suspended' ? 'Akun Disuspend' : 'Akun Diaktifkan', message: newRole === 'suspended' ? 'Akun berhasil disuspend.' : 'Akun berhasil diaktifkan kembali.' });
    } catch (err: unknown) {
      showToast({ variant: 'error', title: 'Gagal', message: err instanceof Error ? err.message : 'Terjadi kesalahan.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditRoleSave = async (id: string, newRole: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role: newRole }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => (newRole === 'user' ? prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)) : prev.filter((u) => u.id !== id)));
      showToast({ variant: 'success', title: 'Role Diperbarui', message: `Role berhasil diubah menjadi "${newRole}".` });
      refetchCounts();
    } catch (err: unknown) {
      showToast({ variant: 'error', title: 'Gagal', message: err instanceof Error ? err.message : 'Terjadi kesalahan.' });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Filter users ──────────────────────────────────────────────
  const filteredUsers = users.filter((u) => u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  // ── Stats & Table ─────────────────────────────────────────────
  const STATS = [
    { label: 'Total Pengguna', value: totalPengguna, unit: 'Pengguna', icon: <Users size={22} strokeWidth={1.8} />, iconBg: 'bg-green-100', iconColor: 'text-green-600', valueColor: 'text-green-500' },
    { label: 'Pengguna Baru', value: penggunaBaru, unit: 'Bulan ini', icon: <UserPlus size={22} strokeWidth={1.8} />, iconBg: 'bg-blue-100', iconColor: 'text-blue-500', valueColor: 'text-blue-500' },
    { label: 'Pengguna Aktif', value: penggunaAktif, unit: '30 hari terakhir', icon: <UserCheck size={22} strokeWidth={1.8} />, iconBg: 'bg-orange-100', iconColor: 'text-orange-500', valueColor: 'text-orange-500' },
    { label: 'Rata-rata Aktivitas', value: rataRata, unit: '% dari total', icon: <Activity size={22} strokeWidth={1.8} />, iconBg: 'bg-purple-100', iconColor: 'text-purple-500', valueColor: 'text-purple-500' },
  ];

  const TABLE_ROWS = [
    { segmen: 'Semua Pengguna', icon: <Users size={16} strokeWidth={1.8} />, iconBg: 'bg-green-100 text-green-600', total: totalPengguna, aktif: penggunaAktif, persen: persenAktif, barColor: 'bg-green-500' },
    { segmen: 'Pengguna Baru', icon: <UserPlus size={16} strokeWidth={1.8} />, iconBg: 'bg-orange-100 text-orange-500', total: penggunaBaru, aktif: penggunaBaru, persen: persenBaru, barColor: 'bg-orange-400' },
    { segmen: 'Pengguna Aktif', icon: <UserCheck size={16} strokeWidth={1.8} />, iconBg: 'bg-blue-100 text-blue-500', total: totalPengguna, aktif: penggunaAktif, persen: persenAktif, barColor: 'bg-blue-600' },
  ];

  const visibleRows = expanded ? TABLE_ROWS : TABLE_ROWS.slice(0, 3);

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-4 sm:p-6 lg:p-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 sm:mb-8 mt-8 sm:mt-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Total Pengguna</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola informasi pengguna aplikasi</p>
          </div>
          <div className="relative flex-shrink-0 self-start sm:self-auto" ref={dateRef}>
            <button onClick={() => setDateOpen((o) => !o)} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors">
              <Calendar size={16} className="text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{formatTanggal(activeDate)}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dateOpen ? 'rotate-180' : ''}`} />
            </button>
            {dateOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-56 text-sm text-gray-500">
                <p className="font-semibold text-gray-700 mb-1">Tanggal aktif</p>
                <p>{formatTanggal(activeDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {STATS.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
              <div className={`p-2.5 sm:p-3 rounded-full ${card.iconBg} ${card.iconColor} flex-shrink-0`}>{card.icon}</div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight truncate">{card.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${card.valueColor} leading-tight mt-0.5`}>{card.label === 'Rata-rata Aktivitas' ? `${card.value}%` : card.value.toLocaleString('id-ID')}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{card.unit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ringkasan Pengguna ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
          <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Ringkasan Pengguna</h2>
          </div>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[30%]">Segmentasi</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[20%]">Total Pengguna</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[20%]">Pengguna Aktif</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-[30%]">Persentase Aktif</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-1.5 rounded-full ${row.iconBg}`}>{row.icon}</span>
                        <span className="font-medium text-gray-800">{row.segmen}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.aktif.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <ProgressBar persen={row.persen} barColor={row.barColor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden divide-y divide-gray-100">
            {visibleRows.map((row, i) => (
              <div key={i} className="px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`p-1.5 rounded-full ${row.iconBg}`}>{row.icon}</span>
                  <span className="font-semibold text-gray-800 text-sm">{row.segmen}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Total Pengguna</p>
                    <p className="text-sm font-semibold text-gray-700">{row.total.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-0.5">Pengguna Aktif</p>
                    <p className="text-sm font-semibold text-gray-700">{row.aktif.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Persentase Aktif</p>
                  <ProgressBar persen={row.persen} barColor={row.barColor} />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 px-6 py-3 flex justify-center">
            <button onClick={() => setExpanded((e) => !e)} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
              {expanded ? <ChevronUp size={15} strokeWidth={2} /> : <ChevronDown size={15} strokeWidth={2} />}
            </button>
          </div>
        </div>

        {/* ── Daftar Pengguna ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
          <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Daftar Pengguna</h2>
              <p className="text-xs text-gray-400 mt-0.5">{filteredUsers.length} pengguna ditemukan</p>
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 w-48 sm:w-56"
                />
              </div>
              <button onClick={fetchUsers} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors" title="Refresh">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Nama</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Bergabung</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <Loader size={22} className="animate-spin text-blue-400 mx-auto" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-sm text-gray-400">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-500">{user.full_name?.[0]?.toUpperCase() ?? '?'}</span>
                          </div>
                          <span className="font-medium text-gray-800 truncate max-w-[140px]">{user.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs truncate max-w-[160px]">{user.email}</td>
                      <td className="px-6 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-400">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-3">
                        <UserActionDropdown user={user} onDelete={handleDeleteRequest} onSuspend={handleSuspendRequest} onEditRole={setEditRoleUser} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-100">
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader size={22} className="animate-spin text-blue-400" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">Tidak ada pengguna ditemukan.</p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-500">{user.full_name?.[0]?.toUpperCase() ?? '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <div className="mt-1">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                  <UserActionDropdown user={user} onDelete={handleDeleteRequest} onSuspend={handleSuspendRequest} onEditRole={setEditRoleUser} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <ModalEditRole user={editRoleUser} onClose={() => setEditRoleUser(null)} onSave={handleEditRoleSave} />
      <ActionToast
        toast={toast}
        onConfirm={(id, role) => {
          if (toast.variant === 'confirm-delete') handleDeleteConfirm(id);
          else handleSuspendConfirm(id, role);
        }}
        onClose={closeToast}
      />
      {actionLoading && (
        <div className="fixed inset-0 z-[9998] flex items-end justify-end p-6 pointer-events-none">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-2.5">
            <Loader size={16} className="animate-spin text-blue-500" />
            <span className="text-xs font-medium text-gray-600">Memproses...</span>
          </div>
        </div>
      )}
    </div>
  );
}
