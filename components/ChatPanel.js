'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ChatPanel({ classId, myName, accentText }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lastId = useRef(0);
  const listRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${classId}?after=${lastId.current}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.messages?.length) {
        setMessages((prev) => [...prev, ...data.messages]);
        lastId.current = data.messages[data.messages.length - 1].id;
      }
    } catch {
      /* keep polling silently */
    } finally {
      setLoaded(true);
    }
  }, [classId]);

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 4000);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft('');
    try {
      const res = await fetch(`/api/chat/${classId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        lastId.current = Math.max(lastId.current, data.message.id);
      }
    } catch {
      /* the message just won't appear; user can retry */
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[60vh] min-h-[360px] flex-col rounded-2xl border border-line bg-card">
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
        {loaded && messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-faint">
            No messages yet &mdash; ask the first question about this class.
          </p>
        )}
        {messages.map((m) => {
          const isMe = m.authorName === myName;
          const isTutor = m.studentId == null;
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="mb-0.5 text-xs text-ink-faint">
                {isTutor ? 'Instructor' : m.authorName} &middot; {formatTime(m.createdAt)}
              </span>
              <span
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] leading-snug ${
                  isTutor
                    ? 'bg-ink text-white'
                    : isMe
                    ? `${accentText} bg-paper border border-line`
                    : 'bg-paper text-ink-soft'
                }`}
              >
                {m.body}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question about this class..."
          maxLength={2000}
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-mark"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
