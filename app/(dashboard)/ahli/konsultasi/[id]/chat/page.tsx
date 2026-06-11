'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Flame } from 'lucide-react';
import { ArrowLeft, Send, User, MoreVertical, PhoneOff, Check, CheckCheck, UserCircle } from 'lucide-react';
import ModalNutrisiPlan from '@/components/componentsDashboardAhli/konsultasi/ModalNutrisiPlan';
import ModalProfilUser from '@/components/componentsDashboardAhli/konsultasi/ui/ModalProfileUser/page';

interface Message {
  id: string;
  sender_id: string;
  message_text: string;
  sent_at: string;
  is_delivered: boolean;
  is_read: boolean;
}

interface ConsultationInfo {
  user_id: string;
  user_name: string;
  user_photo: string | null;
  user_email: string;
  status: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Hari ini';
  if (date.toDateString() === yesterday.toDateString()) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function MessageStatus({ is_delivered, is_read }: { is_delivered: boolean; is_read: boolean }) {
  if (is_read) return <CheckCheck className="w-3.5 h-3.5 text-blue-400 inline-block ml-1" />;
  if (is_delivered) return <CheckCheck className="w-3.5 h-3.5 text-white/60 inline-block ml-1" />;
  return <Check className="w-3.5 h-3.5 text-white/60 inline-block ml-1" />;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export default function ChatPageAhli() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params?.id as string;

  const [showNutrisiModal, setShowNutrisiModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [consultInfo, setConsultInfo] = useState<ConsultationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [ending, setEnding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // ── State modal profil user ──────────────────────────────────────────────
  const [showProfilUser, setShowProfilUser] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const init = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push('/login');
      return;
    }
    setCurrentUserId(session.user.id);

    const { data: consult } = await supabase
      .from('consultations')
      .select(
        `
        status,
        user_id,
        users!consultations_user_id_fkey ( id, full_name, email )
      `,
      )
      .eq('id', consultationId)
      .single();

    if (consult) {
      const userId = (consult as any).users?.id;
      setTargetUserId(userId);

      const { data: userProfile } = await supabase.from('user_profiles').select('photo_url').eq('user_id', userId).maybeSingle();

      setConsultInfo({
        user_id: userId,
        user_name: (consult as any).users?.full_name ?? 'User',
        user_photo: userProfile?.photo_url ?? null,
        user_email: (consult as any).users?.email ?? '',
        status: consult.status,
      });
      setIsEnded(consult.status === 'completed' || consult.status === 'cancelled');
    }

    const { data } = await supabase.from('consultation_messages').select('id, sender_id, message_text, sent_at, is_delivered, is_read').eq('consultation_id', consultationId).order('sent_at', { ascending: true });

    if (data) {
      setMessages(data);
      const unread = data.filter((m) => m.sender_id !== session.user.id && !m.is_read);
      if (unread.length > 0) {
        await supabase
          .from('consultation_messages')
          .update({ is_read: true, is_delivered: true })
          .in(
            'id',
            unread.map((m) => m.id),
          );
      }
    }

    setLoading(false);
  }, [consultationId]);

  useEffect(() => {
    init();

    const msgChannel = supabase
      .channel(`chat:${consultationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'consultation_messages', filter: `consultation_id=eq.${consultationId}` }, async (payload) => {
        const newMsg = payload.new as Message;
        setMessages((prev) => {
          if (prev.find((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (newMsg.sender_id !== session?.user?.id) {
          await supabase.from('consultation_messages').update({ is_read: true, is_delivered: true }).eq('id', newMsg.id);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'consultation_messages', filter: `consultation_id=eq.${consultationId}` }, (payload) => {
        const updated = payload.new as Message;
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
      })
      .subscribe();

    const typingChannel = supabase
      .channel(`typing:${consultationId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.role === 'user') {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [consultationId, init]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (typingTimeout) clearTimeout(typingTimeout);
    await supabase.channel(`typing:${consultationId}`).send({ type: 'broadcast', event: 'typing', payload: { role: 'ahli' } });
    const timeout = setTimeout(() => {}, 3000);
    setTypingTimeout(timeout);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !currentUserId || sending || isEnded) return;
    setSending(true);
    setInput('');
    const { data: newMsg } = await supabase
      .from('consultation_messages')
      .insert({ consultation_id: consultationId, sender_id: currentUserId, message_text: text, sent_at: new Date().toISOString(), is_delivered: false, is_read: false })
      .select()
      .single();
    setSending(false);
    if (!newMsg) setInput(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAkhiriKonsultasi = async () => {
    setEnding(true);
    const { error } = await supabase.from('consultations').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', consultationId);
    setEnding(false);
    setShowConfirm(false);
    setShowMenu(false);
    if (!error) {
      setIsEnded(true);
      setConsultInfo((prev) => (prev ? { ...prev, status: 'completed' } : prev));
    }
  };

  const groupedMessages: { label: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const label = formatDateLabel(msg.sent_at);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.label === label) last.messages.push(msg);
    else groupedMessages.push({ label, messages: [msg] });
  });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="relative flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* ── Foto + nama user: klik untuk buka modal profil ── */}
        <button onClick={() => setShowProfilUser(true)} className="flex items-center gap-3 flex-1 min-w-0 text-left hover:bg-gray-50 rounded-xl px-2 py-1 -mx-2 transition-colors" aria-label="Lihat profil user">
          {consultInfo?.user_photo ? (
            <img src={consultInfo.user_photo} alt={consultInfo.user_name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{consultInfo?.user_name ?? 'User'}</p>
            <div className="flex items-center gap-1.5">
              {isTyping ? (
                <p className="text-xs text-primary italic">sedang mengetik...</p>
              ) : (
                <>
                  <span className={`w-2 h-2 rounded-full ${isEnded ? 'bg-gray-400' : 'bg-green-400'}`} />
                  <p className="text-xs text-gray-400">{isEnded ? 'Konsultasi selesai' : consultInfo?.user_email}</p>
                </>
              )}
            </div>
          </div>
        </button>

        <button onClick={() => setShowMenu((prev) => !prev)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Menu chat">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {/* ── Dropdown menu ── */}
        {showMenu && (
          <div ref={menuRef} className="absolute right-4 top-14 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 min-w-[200px] z-50">
            {/* ── Tombol lihat profil user ── */}
            <button
              onClick={() => {
                setShowProfilUser(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserCircle className="w-4 h-4" />
              Lihat Profil User
            </button>
            <div className="mx-3 border-t border-gray-100 my-1" />
            <button
              onClick={() => {
                setShowNutrisiModal(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <Flame className="w-4 h-4" />
              Buat Rencana Nutrisi
            </button>
            <div className="mx-3 border-t border-gray-100 my-1" />
            <button
              onClick={() => {
                setShowConfirm(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
              Akhiri Konsultasi
            </button>
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="text-center py-2 px-4 flex-shrink-0">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{isEnded ? '🔒 Konsultasi telah berakhir' : 'Konsultasi dimulai'}</span>
      </div>

      {/* Area Pesan */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {messages.length === 0 && !isTyping ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-4xl">💬</p>
            <p className="text-sm">Belum ada pesan. Mulai konsultasi!</p>
          </div>
        ) : (
          <>
            {groupedMessages.map((group) => (
              <div key={group.label}>
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{group.label}</span>
                </div>
                {group.messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'}`}>
                        <p className="whitespace-pre-wrap break-words">{msg.message_text}</p>
                        <div className={`flex items-center justify-end gap-0.5 mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                          <span className="text-[10px]">{formatTime(msg.sent_at)}</span>
                          {isMe && <MessageStatus is_delivered={msg.is_delivered} is_read={msg.is_read} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      {isEnded ? (
        <div className="flex-shrink-0 px-4 py-4 bg-white border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">🔒 Konsultasi telah berakhir. Chat tidak dapat dilanjutkan.</p>
        </div>
      ) : (
        <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pesan Anda..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none max-h-32 py-1.5"
              style={{ minHeight: '36px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-9 h-9 flex items-center justify-center bg-primary hover:bg-primary/90 disabled:bg-gray-200 text-white rounded-xl transition-colors flex-shrink-0 mb-0.5"
            >
              {sending ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-1.5">Enter untuk kirim · Shift+Enter untuk baris baru</p>
        </div>
      )}

      {/* Modal Konfirmasi Akhiri */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <PhoneOff className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800 text-center mb-2">Akhiri Konsultasi?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Konsultasi dengan pasien akan berakhir dan chat tidak bisa dilanjutkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleAkhiriKonsultasi} disabled={ending} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-xl transition-colors">
                {ending ? 'Mengakhiri...' : 'Ya, Akhiri'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rencana Nutrisi */}
      {showNutrisiModal && targetUserId && <ModalNutrisiPlan isOpen={showNutrisiModal} onClose={() => setShowNutrisiModal(false)} consultationId={consultationId} userId={targetUserId} userName={consultInfo?.user_name ?? 'User'} />}

      {/* ── Modal Profil User ────────────────────────────────────────────── */}
      {consultInfo?.user_id && <ModalProfilUser isOpen={showProfilUser} onClose={() => setShowProfilUser(false)} userId={consultInfo.user_id}  />}
    </div>
  );
}
