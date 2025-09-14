import { useEffect, useRef } from "react";
import DownloadMarkdown from "./downloadMarkdown";

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
       p-4">
      {/* <p>{chats}</p> */}
      {/* <Markdown>{String(chats)}</Markdown> */}
      <DownloadMarkdown>{String(chats)}</DownloadMarkdown>


    </div>
  )
}