import { useEffect, useState, useRef, useCallback } from "react";
import api from "../utils/api";
import { io } from "socket.io-client";

export default function ChatWindow({ jobId, applicantId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [resolvedApplicantId, setResolvedApplicantId] = useState(applicantId || null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!resolvedApplicantId) {
      try {
        const token = localStorage.getItem("token");
        const parts = token ? token.split(".") : [];
        const body = parts.length > 1 ? parts[1] : "";
        const payload = body ? JSON.parse(atob(body)) : null;
        if (payload?.id) setResolvedApplicantId(payload.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, [resolvedApplicantId]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/chat/${jobId}/${resolvedApplicantId}/messages`);
      setMessages(res.data?.messages || []);
    } catch (err) {
          console.error(err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [jobId, resolvedApplicantId]);

  useEffect(() => {
    if (!jobId || !resolvedApplicantId) return;
    fetchMessages();
    try {
      const token = localStorage.getItem("token");
      const apiBase = api.defaults.baseURL || "";
      const base = apiBase ? apiBase.replace(/\/api\/?$/, "") : "http://localhost:5000";
      const socket = io(base, { auth: { token } });
      socketRef.current = socket;
      socket.on("connect", () => {
        socket.emit("chat:join", { jobId, applicantId: resolvedApplicantId });
      });
      socket.on("chat:init", (data) => {
        setMessages(data?.messages || []);
      });
      socket.on("chat:message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.error(err);
    }
  }, [jobId, resolvedApplicantId, fetchMessages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      setSending(true);
      if (socketRef.current?.connected) {
        socketRef.current.emit("chat:message", { jobId, applicantId: resolvedApplicantId, text });
      } else {
        await api.post(`/chat/${jobId}/${resolvedApplicantId}/messages`, { text });
        fetchMessages();
      }
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl border shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Chat</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>
        <div className="p-4 h-80 overflow-y-auto space-y-3">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet</div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === resolvedApplicantId ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${m.sender === resolvedApplicantId ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                  {m.text}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            disabled={sending}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
