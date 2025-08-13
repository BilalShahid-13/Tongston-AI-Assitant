import "highlight.js/styles/github.css"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

export default function Markdown({ children }: { children: string }) {
  const sanitizeMarkdown = (text: string) => {
    let fixed = text;

    // Space after ###
    fixed = fixed.replace(/(#{1,6})([^\s#])/g, "$1 $2");

    // Newline before headings
    fixed = fixed.replace(/([^\n])\s*(#{1,6}\s)/g, "$1\n$2");

    // Newline before numbered list (e.g., 1. Item)
    fixed = fixed.replace(/([^\n])(\d+\.\s)/g, "$1\n$2");

    // Newline before bullet list (- Item)
    fixed = fixed.replace(/([^\n])(-\s)/g, "$1\n$2");

    return fixed;
  };


  return (
    <div className="prose max-w-none prose-headings:mt-4 prose-p:mt-2">
      <ReactMarkdown
        components={{
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          table: ({ node, ...props }) => (
            <table className="table-auto border border-gray-400">{props.children}</table>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-400 bg-gray-200 px-4 py-2 font-semibold">
              {props.children}
            </th>
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2">{props.children}</td>
          ),
          a: ({ node, ...props }) => (
            <a {...props} className="underline text-yellow-500" />
          ),
        }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {sanitizeMarkdown(children)}
      </ReactMarkdown>
    </div>
  );
}
