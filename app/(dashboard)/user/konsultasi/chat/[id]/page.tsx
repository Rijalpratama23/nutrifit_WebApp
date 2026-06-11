'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { ArrowLeft, Send, User, Check, CheckCheck, Info } from 'lucide-react';
import ModalProfilAhli from '@/components/componentsDashboardUser/konsultasiUser/ui/ModalProfileAhli/page';

interface Message {
  id: string;
  sender_id: string;
  message_text: string;
  sent_at: string;
  is_delivered: boolean;
  is_read: boolean;
}

interface ConsultationInfo {
  ahli_id: string;
  ahli_name: string;
  ahli_photo: string | null;
  ahli_specialization: string;
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

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params?.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [consultInfo, setConsultInfo] = useState<ConsultationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // ── State modal profil ahli ──────────────────────────────────────────────
  const [showProfilAhli, setShowProfilAhli] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        ahli_id,
        ahli_profiles (
          id,
          specialization,
          profile_photo_url,
          users ( full_name )
        )
      `,
      )
      .eq('id', consultationId)
      .single();

    if (consult) {
      setConsultInfo({
        ahli_id: (consult as any).ahli_id,
        ahli_name: (consult as any).ahli_profiles?.users?.full_name ?? 'Ahli',
        ahli_photo: (consult as any).ahli_profiles?.profile_photo_url ?? null,
        ahli_specialization: (consult as any).ahli_profiles?.specialization ?? '',
        status: consult.status,
      });
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
        if (payload.payload?.role === 'ahli') {
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (typingTimeout) clearTimeout(typingTimeout);
    await supabase.channel(`typing:${consultationId}`).send({ type: 'broadcast', event: 'typing', payload: { role: 'user' } });
    const timeout = setTimeout(() => {}, 3000);
    setTypingTimeout(timeout);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !currentUserId || sending) return;
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
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* ── Foto + nama ahli: klik untuk buka modal profil ── */}
        <button onClick={() => setShowProfilAhli(true)} className="flex items-center gap-3 flex-1 min-w-0 text-left hover:bg-gray-50 rounded-xl px-2 py-1 -mx-2 transition-colors" aria-label="Lihat profil ahli">
          {consultInfo?.ahli_photo ? (
            <img src={consultInfo.ahli_photo} alt={consultInfo.ahli_name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{consultInfo?.ahli_name ?? 'Ahli'}</p>
            <div className="flex items-center gap-1.5">
              {isTyping ? (
                <p className="text-xs text-primary italic">sedang mengetik...</p>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-xs text-gray-400">{consultInfo?.ahli_specialization}</p>
                </>
              )}
            </div>
          </div>
        </button>

        {/* ── Tombol lihat profil (opsional, alternatif trigger) ── */}
        <button onClick={() => setShowProfilAhli(true)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label="Lihat profil ahli" title="Lihat profil ahli">
          <Info className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Info banner */}
      <div className="text-center py-2 px-4 flex-shrink-0">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Konsultasi dimulai</span>
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

      {/* ── Modal Profil Ahli ──────────────────────────────────────────────── */}
      {consultInfo?.ahli_id && <ModalProfilAhli isOpen={showProfilAhli} onClose={() => setShowProfilAhli(false)} ahliId={consultInfo.ahli_id} />}
    </div>
  );
}
