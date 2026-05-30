'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { ArrowLeft, Send, User, MoreVertical } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  sender_id: string;
  message_text: string;
  sent_at: string;
}

interface ConsultationInfo {
  ahli_name: string;
  ahli_photo: string | null;
  ahli_specialization: string;
  status: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
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

// ─── Komponen ─────────────────────────────────────────────────────────────────

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
        ahli_profiles (
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
        ahli_name: (consult as any).ahli_profiles?.users?.full_name ?? 'Ahli',
        ahli_photo: (consult as any).ahli_profiles?.profile_photo_url ?? null,
        ahli_specialization: (consult as any).ahli_profiles?.specialization ?? '',
        status: consult.status,
      });
    }

    const { data } = await supabase.from('consultation_messages').select('id, sender_id, message_text, sent_at').eq('consultation_id', consultationId).order('sent_at', { ascending: true });

    if (data) setMessages(data);
    setLoading(false);
  }, [consultationId]);

  useEffect(() => {
    init();

    const channel = supabase
      .channel(`chat:${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages',
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [consultationId, init]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !currentUserId || sending) return;

    setSending(true);
    setInput('');

    const { error } = await supabase.from('consultation_messages').insert({
      consultation_id: consultationId,
      sender_id: currentUserId,
      message_text: text,
      sent_at: new Date().toISOString(),
    });

    setSending(false);
    if (error) setInput(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group pesan by tanggal
  const groupedMessages: { label: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const label = formatDateLabel(msg.sent_at);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.label === label) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ label, messages: [msg] });
    }
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

        {consultInfo?.ahli_photo ? (
          <img src={consultInfo.ahli_photo} alt={consultInfo.ahli_name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">{consultInfo?.ahli_name ?? 'Ahli'}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-xs text-gray-400">{consultInfo?.ahli_specialization}</p>
          </div>
        </div>

        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Info banner */}
      <div className="text-center py-2 px-4 flex-shrink-0">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Konsultasi dimulai</span>
      </div>

      {/* Area Pesan */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-4xl">💬</p>
            <p className="text-sm">Belum ada pesan. Mulai konsultasi!</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
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
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>{formatTime(msg.sent_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-end gap-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
    </div>
  );
}
