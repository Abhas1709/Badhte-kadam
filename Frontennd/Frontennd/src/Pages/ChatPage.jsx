import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ChatWindow from "../Component/ChatWindow";

export default function ChatPage() {
  const { jobId } = useParams();
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/student/applications" className="text-gray-600 hover:text-gray-900">Back to Applications</Link>
      </div>
      {open && <ChatWindow jobId={jobId} onClose={() => setOpen(false)} />}
    </div>
  );
}
