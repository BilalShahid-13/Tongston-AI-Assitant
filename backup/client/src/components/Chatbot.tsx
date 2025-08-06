import { useEffect, useRef } from "react";

export default function AIAssistant({ chats }: { chats: string | null }) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div
      ref={chatRef}
      className="flex flex-col border rounded-lg bg-card shadow-sm
      max-h-[75vh] overflow-y-scroll p-4">
      <p>{chats}</p>

    </div>
  )
}