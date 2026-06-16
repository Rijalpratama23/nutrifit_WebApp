'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Stethoscope,
  UserPlus,
  UserCheck,
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Trash2,
  ShieldOff,
  ShieldCheck,
  UserCog,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Loader,
  MoreVertical,
  RefreshCw,
  BadgeX,
} from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { supabase } from '@/utils/supabase/client';
import { createPortal } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────
interface Props {
  totalAhli: number;
  ahliBaru: number;
  ahliVerified: number;
  rataRataAktivitas: number;
  persenBaru: number;
  persenVerified: number;
}

interface AhliRow {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  specialization?: string;
  experience_years?: number;
  is_verified?: boolean;
}

type ToastVariant = 'confirm-delete' | 'confirm-suspend' | 'confirm-verify' | 'success' | 'error';

interface ToastState {
  open: boolean;
  variant: ToastVariant;
  title: string;
  message: string;
  targetId?: string;
  targetName?: string;
  targetRole?: string;
  targetVerified?: boolean;
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

function ProgressBar({ persen, color, slim = false }: { persen: number; color: string; slim?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${slim ? 'w-16' : 'w-16 sm:w-24 md:w-28'} h-2 bg-gray-100 rounded-full overflow-hidden`}>
        <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${Math.min(persen, 100)}%` }} />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">{persen}%</span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ahli: 'bg-green-100 text-green-600 border border-green-200',
    user: 'bg-blue-100 text-blue-600 border border-blue-200',
    admin: 'bg-purple-100 text-purple-600 border border-purple-200',
    suspended: 'bg-red-100 text-red-500 border border-red-200',
  };
  const label: Record<string, string> = { ahli: 'Ahli', user: 'User', admin: 'Admin', suspended: 'Suspended' };
  return <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${map[role] ?? 'bg-gray-100 text-gray-500 border border-gray-200'}`}>{label[role] ?? role}</span>;
}

function VerifiedBadge({ verified }: { verified?: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-200">
      <BadgeCheck size={10} /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
      <BadgeX size={10} /> Belum
    </span>
  );
}

// ─── Action Toast ─────────────────────────────────────────────
function ActionToast({ toast, onConfirm, onClose }: { toast: ToastState; onConfirm: (id: string, extra?: string) => void; onClose: () => void }) {
  if (!toast.open) return null;
  const isConfirm = ['confirm-delete', 'confirm-suspend', 'confirm-verify'].includes(toast.variant);
  const iconMap: Record<ToastVariant, React.ReactNode> = {
    'confirm-delete': <AlertTriangle size={20} className="text-red-500 shrink-0" />,
    'confirm-suspend': <AlertTriangle size={20} className="text-yellow-500 shrink-0" />,
    'confirm-verify': <AlertTriangle size={20} className="text-blue-500 shrink-0" />,
    success: <CheckCircle size={20} className="text-green-500 shrink-0" />,
    error: <XCircle size={20} className="text-red-500 shrink-0" />,
  };
  const borderMap: Record<ToastVariant, string> = {
    'confirm-delete': 'border-red-200',
    'confirm-suspend': 'border-yellow-200',
    'confirm-verify': 'border-blue-200',
    success: 'border-green-200',
    error: 'border-red-200',
  };
  const btnColor: Record<ToastVariant, string> = {
    'confirm-delete': 'bg-red-500 hover:bg-red-600',
    'confirm-suspend': 'bg-yellow-500 hover:bg-yellow-600',
    'confirm-verify': 'bg-blue-500 hover:bg-blue-600',
    success: '',
    error: '',
  };
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
                <button onClick={() => onConfirm(toast.targetId!, toast.targetRole)} className={`flex-1 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ${btnColor[toast.variant]}`}>
                  Ya, Lanjutkan
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
    const dropdownWidth = 208; // w-52
    const dropdownHeight = 240; // perkiraan tinggi

    let top = rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - dropdownWidth;

    if (rect.bottom + dropdownHeight > window.innerHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 4;
    }

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
        width: '208px', // w-52
      }}
      className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {children}
    </div>,
    document.body,
  );
}

// ─── Dropdown Aksi ────────────────────────────────────────────
function AhliActionDropdown({
  ahli,
  onDelete,
  onSuspend,
  onEditRole,
  onVerify,
}: {
  ahli: AhliRow;
  onDelete: (id: string, name: string) => void;
  onSuspend: (id: string, name: string, role: string) => void;
  onEditRole: (a: AhliRow) => void;
  onVerify: (id: string, name: string, currentVerified: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isSuspended = ahli.role === 'suspended';
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
        {/* Verifikasi */}
        <button
          onClick={() => {
            close();
            onVerify(ahli.id, ahli.full_name, ahli.is_verified ?? false);
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors text-left ${ahli.is_verified ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
        >
          {ahli.is_verified ? <BadgeX size={14} /> : <BadgeCheck size={14} />}
          <span>{ahli.is_verified ? 'Batalkan Verifikasi' : 'Verifikasi Ahli'}</span>
        </button>

        {/* Edit Role */}
        <button
          onClick={() => {
            close();
            onEditRole(ahli);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors text-left"
        >
          <UserCog size={14} />
          <span>Edit Role</span>
        </button>

        {/* Suspend */}
        <button
          onClick={() => {
            close();
            onSuspend(ahli.id, ahli.full_name, ahli.role);
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
            onDelete(ahli.id, ahli.full_name);
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
function ModalEditRole({ ahli, onClose, onSave }: { ahli: AhliRow | null; onClose: () => void; onSave: (id: string, newRole: string) => Promise<void> }) {
  const [selectedRole, setSelectedRole] = useState(ahli?.role ?? 'ahli');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ahli) setSelectedRole(ahli.role);
  }, [ahli]);
  if (!ahli) return null;

  const roles = [
    { value: 'ahli', label: 'Ahli', desc: 'Ahli gizi yang terdaftar' },
    { value: 'user', label: 'User', desc: 'Pengguna biasa aplikasi' },
    { value: 'admin', label: 'Admin', desc: 'Administrator sistem' },
  ];

  const handleSave = async () => {
    setLoading(true);
    await onSave(ahli.id, selectedRole);
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
            <p className="text-xs text-gray-400 truncate max-w-[200px]">{ahli.full_name}</p>
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
            disabled={loading || selectedRole === ahli.role}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader size={13} className="animate-spin" />} Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ContainerTotalAhli({ totalAhli: initTotal, ahliBaru: initBaru, ahliVerified: initVerified, rataRataAktivitas: initRata, persenBaru: initPersenBaru, persenVerified: initPersenVerified }: Props) {
  const { isCollapsed, isMobile } = useSidebar();
  const [expanded, setExpanded] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [activeDate] = useState(new Date());
  const dateRef = useRef<HTMLDivElement>(null);

  // ── Stat state ────────────────────────────────────────────────
  const [totalAhli, setTotalAhli] = useState(initTotal);
  const [ahliBaru, setAhliBaru] = useState(initBaru);
  const [ahliVerified, setAhliVerified] = useState(initVerified);
  const [rataRata, setRataRata] = useState(initRata);
  const [persenBaru, setPersenBaru] = useState(initPersenBaru);
  const [persenVerified, setPersenVerified] = useState(initPersenVerified);

  // ── Ahli table state ──────────────────────────────────────────
  const [ahliList, setAhliList] = useState<AhliRow[]>([]);
  const [ahliLoading, setAhliLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editRoleAhli, setEditRoleAhli] = useState<AhliRow | null>(null);

  // ── Toast ─────────────────────────────────────────────────────
  const [toast, setToast] = useState<ToastState>({ open: false, variant: 'success', title: '', message: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (state: Omit<ToastState, 'open'>, autoDismiss = true) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ ...state, open: true });
    if (autoDismiss && !['confirm-delete', 'confirm-suspend', 'confirm-verify'].includes(state.variant)) {
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
      const res = await fetch('/api/total-ahli');
      const data = await res.json();
      setTotalAhli(data.totalAhli);
      setAhliBaru(data.ahliBaru);
      setAhliVerified(data.ahliVerified);
      setRataRata(data.rataRataAktivitas);
      setPersenBaru(data.persenBaru);
      setPersenVerified(data.persenVerified);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Fetch ahli list ───────────────────────────────────────────
  const fetchAhli = useCallback(async () => {
    setAhliLoading(true);
    try {
      const res = await fetch('/api/admin/users?role=ahli');
      const data = await res.json();
      const ids = (data.users ?? []).map((u: AhliRow) => u.id);
      if (ids.length === 0) {
        setAhliList([]);
        return;
      }

      const { data: profiles } = await supabase.from('ahli_profiles').select('user_id, specialization, experience_years, is_verified').in('user_id', ids);

      const profileMap: Record<string, { specialization?: string; experience_years?: number; is_verified?: boolean }> = {};
      (profiles ?? []).forEach((p: { user_id: string; specialization?: string; experience_years?: number; is_verified?: boolean }) => {
        profileMap[p.user_id] = p;
      });

      setAhliList(
        (data.users ?? []).map((u: AhliRow) => ({
          ...u,
          specialization: profileMap[u.id]?.specialization,
          experience_years: profileMap[u.id]?.experience_years,
          is_verified: profileMap[u.id]?.is_verified ?? false,
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setAhliLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAhli();
  }, [fetchAhli]);

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
      .channel('total-ahli-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        refetchCounts();
        fetchAhli();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ahli_profiles' }, () => {
        refetchCounts();
        fetchAhli();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAhli]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleDeleteRequest = (id: string, name: string) => {
    showToast({ variant: 'confirm-delete', title: 'Hapus Akun Ahli?', message: `Akun "${name}" akan dihapus permanen beserta seluruh datanya.`, targetId: id }, false);
  };

  const handleDeleteConfirm = async (id: string) => {
    closeToast();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setAhliList((prev) => prev.filter((a) => a.id !== id));
      showToast({ variant: 'success', title: 'Akun Dihapus', message: 'Akun ahli berhasil dihapus dari sistem.' });
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
        message: isSuspended ? `Akun "${name}" akan diaktifkan kembali.` : `Akun "${name}" akan disuspend dan tidak bisa login.`,
        targetId: id,
        targetRole: currentRole,
      },
      false,
    );
  };

  const handleSuspendConfirm = async (id: string, currentRole?: string) => {
    closeToast();
    setActionLoading(true);
    const newRole = currentRole === 'suspended' ? 'ahli' : 'suspended';
    try {
      const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role: newRole }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setAhliList((prev) => prev.map((a) => (a.id === id ? { ...a, role: newRole } : a)));
      showToast({ variant: 'success', title: newRole === 'suspended' ? 'Akun Disuspend' : 'Akun Diaktifkan', message: newRole === 'suspended' ? 'Akun ahli berhasil disuspend.' : 'Akun berhasil diaktifkan kembali.' });
    } catch (err: unknown) {
      showToast({ variant: 'error', title: 'Gagal', message: err instanceof Error ? err.message : 'Terjadi kesalahan.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyRequest = (id: string, name: string, currentVerified: boolean) => {
    showToast(
      {
        variant: 'confirm-verify',
        title: currentVerified ? 'Batalkan Verifikasi?' : 'Verifikasi Ahli?',
        message: currentVerified ? `Status verifikasi "${name}" akan dibatalkan.` : `"${name}" akan ditandai sebagai ahli terverifikasi.`,
        targetId: id,
        targetVerified: currentVerified,
      },
      false,
    );
  };

  const handleVerifyConfirm = async (id: string) => {
    closeToast();
    setActionLoading(true);
    const ahli = ahliList.find((a) => a.id === id);
    const newVerified = !(ahli?.is_verified ?? false);
    try {
      const { error } = await supabase.from('ahli_profiles').update({ is_verified: newVerified }).eq('user_id', id);
      if (error) throw new Error(error.message);
      setAhliList((prev) => prev.map((a) => (a.id === id ? { ...a, is_verified: newVerified } : a)));
      showToast({ variant: 'success', title: newVerified ? 'Ahli Diverifikasi' : 'Verifikasi Dibatalkan', message: newVerified ? 'Status ahli berhasil diverifikasi.' : 'Status verifikasi berhasil dibatalkan.' });
      refetchCounts();
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
      setAhliList((prev) => (newRole === 'ahli' ? prev.map((a) => (a.id === id ? { ...a, role: newRole } : a)) : prev.filter((a) => a.id !== id)));
      showToast({ variant: 'success', title: 'Role Diperbarui', message: `Role berhasil diubah menjadi "${newRole}".` });
      refetchCounts();
    } catch (err: unknown) {
      showToast({ variant: 'error', title: 'Gagal', message: err instanceof Error ? err.message : 'Terjadi kesalahan.' });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Filter ────────────────────────────────────────────────────
  const filtered = ahliList.filter((a) => a.full_name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || (a.specialization ?? '').toLowerCase().includes(search.toLowerCase()));

  // ── Stats & Table Rows ────────────────────────────────────────
  const STATS = [
    { label: 'Total Ahli', value: totalAhli, unit: 'Ahli', icon: <Stethoscope size={20} />, color: 'bg-green-100', iconColor: 'text-green-500', valueColor: 'text-green-500' },
    { label: 'Ahli Baru', value: ahliBaru, unit: 'Bulan ini', icon: <UserPlus size={20} />, color: 'bg-blue-100', iconColor: 'text-blue-400', valueColor: 'text-blue-500' },
    { label: 'Ahli Terverifikasi', value: ahliVerified, unit: 'Terverifikasi', icon: <BadgeCheck size={20} />, color: 'bg-orange-100', iconColor: 'text-orange-400', valueColor: 'text-orange-500' },
    { label: 'Rata-rata Verifikasi', value: rataRata, unit: '% dari total', icon: <Activity size={20} />, color: 'bg-purple-100', iconColor: 'text-purple-400', valueColor: 'text-purple-500' },
  ];

  const TABLE_ROWS = [
    { label: 'Total Ahli', icon: <Stethoscope size={16} />, iconBg: 'bg-green-100 text-green-500', total: totalAhli, aktif: ahliVerified, persen: persenVerified, barColor: 'bg-green-400' },
    { label: 'Ahli Baru', icon: <UserPlus size={16} />, iconBg: 'bg-orange-100 text-orange-400', total: ahliBaru, aktif: ahliBaru, persen: persenBaru, barColor: 'bg-orange-400' },
    { label: 'Ahli Terverifikasi', icon: <UserCheck size={16} />, iconBg: 'bg-blue-100 text-blue-400', total: totalAhli, aktif: ahliVerified, persen: persenVerified, barColor: 'bg-blue-500' },
  ];

  const displayRows = expanded ? TABLE_ROWS : TABLE_ROWS.slice(0, 3);

  return (
    <div className={`flex-1 min-w-0 min-h-screen bg-[#EEF2F7] transition-all duration-300 ${isMobile ? 'ml-0 mt-14' : isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
      <div className="p-3 sm:p-4 md:p-6 lg:p-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6 mt-8 sm:mt-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Total Ahli</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kelola informasi Ahli Gizi</p>
          </div>
          <div className="relative flex-shrink-0 self-start sm:self-auto" ref={dateRef}>
            <button
              onClick={() => setDateOpen((o) => !o)}
              className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              <Calendar size={14} className="text-blue-500 flex-shrink-0" />
              <span className="sm:hidden">
                {activeDate.getDate()} {BULAN[activeDate.getMonth()]} {activeDate.getFullYear()}
              </span>
              <span className="hidden sm:inline">{formatTanggal(activeDate)}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${dateOpen ? 'rotate-180' : ''}`} />
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {STATS.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className={`${card.color} ${card.iconColor} rounded-full p-2.5 sm:p-3 flex-shrink-0`}>{card.icon}</div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-0.5 truncate">{card.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${card.valueColor} leading-none`}>{card.label === 'Rata-rata Verifikasi' ? `${card.value}%` : card.value.toLocaleString('id-ID')}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{card.unit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ringkasan Ahli ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-5">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-4 sm:mb-5">Ringkasan Ahli</h2>
          {/* Mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            {displayRows.map((row) => (
              <div key={row.label} className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`${row.iconBg} rounded-full p-1.5`}>{row.icon}</span>
                  <span className="font-semibold text-sm text-gray-700">{row.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Total Ahli</p>
                    <p className="font-bold text-sm text-gray-700">{row.total.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Aktif</p>
                    <p className="font-bold text-sm text-gray-700">{row.aktif.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Persentase</p>
                    <ProgressBar persen={row.persen} color={row.barColor} slim />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 px-2">
              <span>Segmentasi</span>
              <span className="text-center">Total Ahli</span>
              <span className="text-center">Ahli Aktif</span>
              <span className="text-center">Persentase Aktif</span>
            </div>
            <div>
              {displayRows.map((row) => (
                <div key={row.label} className="grid grid-cols-4 items-center py-3 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl transition-colors px-2">
                  <div className="flex items-center gap-2">
                    <span className={`${row.iconBg} rounded-full p-1.5`}>{row.icon}</span>
                    <span className="font-medium">{row.label}</span>
                  </div>
                  <span className="text-center font-semibold">{row.total.toLocaleString('id-ID')}</span>
                  <span className="text-center font-semibold">{row.aktif.toLocaleString('id-ID')}</span>
                  <div className="flex justify-center">
                    <ProgressBar persen={row.persen} color={row.barColor} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors">
              {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* ── Daftar Ahli ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-visible">
          <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Daftar Ahli</h2>
              <p className="text-xs text-gray-400 mt-0.5">{filtered.length} ahli ditemukan</p>
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, email, spesialisasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 w-52 sm:w-64"
                />
              </div>
              <button onClick={fetchAhli} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors" title="Refresh">
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
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Spesialisasi</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Verifikasi</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Bergabung</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {ahliLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      <Loader size={22} className="animate-spin text-blue-400 mx-auto" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-sm text-gray-400">
                      Tidak ada ahli ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((ahli) => (
                    <tr key={ahli.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-green-600">{ahli.full_name?.[0]?.toUpperCase() ?? '?'}</span>
                          </div>
                          <span className="font-medium text-gray-800 truncate max-w-[120px]">{ahli.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500 truncate max-w-[150px]">{ahli.email}</td>
                      <td className="px-6 py-3 text-xs text-gray-600">{ahli.specialization ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-6 py-3">
                        <VerifiedBadge verified={ahli.is_verified} />
                      </td>
                      <td className="px-6 py-3">
                        <RoleBadge role={ahli.role} />
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-400">{formatDate(ahli.created_at)}</td>
                      <td className="px-6 py-3">
                        <AhliActionDropdown ahli={ahli} onDelete={handleDeleteRequest} onSuspend={handleSuspendRequest} onEditRole={setEditRoleAhli} onVerify={handleVerifyRequest} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-100">
            {ahliLoading ? (
              <div className="flex justify-center py-8">
                <Loader size={22} className="animate-spin text-blue-400" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">Tidak ada ahli ditemukan.</p>
            ) : (
              filtered.map((ahli) => (
                <div key={ahli.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">{ahli.full_name?.[0]?.toUpperCase() ?? '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{ahli.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{ahli.email}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <RoleBadge role={ahli.role} />
                      <VerifiedBadge verified={ahli.is_verified} />
                    </div>
                  </div>
                  <AhliActionDropdown ahli={ahli} onDelete={handleDeleteRequest} onSuspend={handleSuspendRequest} onEditRole={setEditRoleAhli} onVerify={handleVerifyRequest} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <ModalEditRole ahli={editRoleAhli} onClose={() => setEditRoleAhli(null)} onSave={handleEditRoleSave} />
      <ActionToast
        toast={toast}
        onConfirm={(id, role) => {
          if (toast.variant === 'confirm-delete') handleDeleteConfirm(id);
          else if (toast.variant === 'confirm-suspend') handleSuspendConfirm(id, role);
          else if (toast.variant === 'confirm-verify') handleVerifyConfirm(id);
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
