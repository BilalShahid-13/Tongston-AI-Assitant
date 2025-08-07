import 'highlight.js/styles/github.css';
import { useEffect, useRef, useState } from 'react';
import { FaRegFilePdf } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';

export default function Markdown({ children, isButtonEnable = true }: { children: string; isButtonEnable?: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const promiseResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    contentRef, // ✅ v3 uses contentRef directly
    onBeforePrint: () =>
      new Promise<void>((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      }),
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
    documentTitle: 'Lesson Plan',
    // removeAfterPrint: true,
  });

  return (
    <>
      {/* Printable content */}
      <div ref={contentRef}>
        <div id="print-root" className="prose max-w-none prose-headings:mt-4 prose-p:mt-2">
          <ReactMarkdown
            components={{
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              table: ({ node, ...props }) => (
                <table className="table-auto border border-gray-400">{props.children}</table>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-gray-400 bg-gray-200 px-4 py-2 font-semibold">{props.children}</th>
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
            {children}
          </ReactMarkdown>
        </div>
      </div>

      {/* Print button */}
      {isButtonEnable && <Button
        onClick={handlePrint}
        className="bg-yellow-400 w-full cursor-pointer mt-4"
        disabled={isPrinting}
      >
        {isPrinting ? (
          <>
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Preparing PDF...
          </>
        ) : (
          <>
            <FaRegFilePdf className="mr-2" />
            Generate PDF
          </>
        )}
      </Button>}
    </>
  );
}
