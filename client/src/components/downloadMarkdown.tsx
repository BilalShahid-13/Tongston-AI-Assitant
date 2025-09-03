import "highlight.js/styles/github.css"
import { useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

export default function DownloadMarkdown({ children }: { children: string; isButtonEnable?: boolean; fileName?: string }) {
  const contentRef = useRef<HTMLDivElement>(null)
  // const [isGenerating, setIsGenerating] = useState(false)

  // const generatePDF = async () => {
  //   if (!contentRef.current) return

  //   setIsGenerating(true)

  //   try {
  //     const renderedContent = contentRef.current.querySelector("#print-root")
  //     if (!renderedContent) return

  //     // Create a completely isolated container
  //     const tempContainer = document.createElement("div")
  //     tempContainer.style.cssText = `
  //       position: fixed;
  //       top: -9999px;
  //       left: -9999px;
  //       width: 800px;
  //       background-color: rgb(255, 255, 255);
  //       color: rgb(0, 0, 0);
  //       font-family: system-ui, -apple-system, sans-serif;
  //       font-size: 14px;
  //       line-height: 1.6;
  //       padding: 32px;
  //       box-sizing: border-box;
  //     `

  //     const clonedContent = renderedContent.cloneNode(true) as HTMLElement
  //     tempContainer.appendChild(clonedContent)

  //     const applyCleanStyles = (element: HTMLElement) => {
  //       const tagName = element.tagName.toLowerCase()

  //       // Remove any existing classes
  //       element.className = ""
  //       element.removeAttribute("class")

  //       // Apply styles based on tag
  //       const baseStyle = "color: rgb(0, 0, 0); background-color: transparent;"

  //       switch (tagName) {
  //         case "h1":
  //           element.style.cssText = baseStyle + "font-size: 32px; font-weight: 700; margin: 24px 0 16px 0;"
  //           break
  //         case "h2":
  //           element.style.cssText = baseStyle + "font-size: 24px; font-weight: 600; margin: 20px 0 12px 0;"
  //           break
  //         case "h3":
  //           element.style.cssText = baseStyle + "font-size: 20px; font-weight: 600; margin: 16px 0 8px 0;"
  //           break
  //         case "h4":
  //           element.style.cssText = baseStyle + "font-size: 18px; font-weight: 600; margin: 14px 0 6px 0;"
  //           break
  //         case "p":
  //           element.style.cssText = baseStyle + "margin: 12px 0; line-height: 1.6;"
  //           break
  //         case "table":
  //           element.style.cssText =
  //             baseStyle +
  //             "border-collapse: collapse; width: 100%; margin: 16px 0; border: 1px solid rgb(156, 163, 175);"
  //           break
  //         case "th":
  //           element.style.cssText =
  //             "border: 1px solid rgb(156, 163, 175); padding: 12px 16px; background-color: rgb(229, 231, 235); font-weight: 600; color: rgb(0, 0, 0);"
  //           break
  //         case "td":
  //           element.style.cssText =
  //             "border: 1px solid rgb(209, 213, 219); padding: 12px 16px; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);"
  //           break
  //         case "a":
  //           element.style.cssText = baseStyle + "color: rgb(234, 179, 8); text-decoration: underline;"
  //           break
  //         case "strong":
  //         case "b":
  //           element.style.cssText = baseStyle + "font-weight: 700;"
  //           break
  //         case "em":
  //         case "i":
  //           element.style.cssText = baseStyle + "font-style: italic;"
  //           break
  //         case "code":
  //           element.style.cssText =
  //             "background-color: rgb(243, 244, 246); padding: 4px 6px; border-radius: 4px; font-family: monospace; color: rgb(0, 0, 0); font-size: 13px;"
  //           break
  //         case "pre":
  //           element.style.cssText =
  //             "background-color: rgb(248, 249, 250); padding: 16px; border-radius: 6px; overflow-x: auto; margin: 16px 0; color: rgb(0, 0, 0); font-family: monospace;"
  //           break
  //         case "ul":
  //         case "ol":
  //           element.style.cssText = baseStyle + "margin: 12px 0; padding-left: 24px;"
  //           break
  //         case "li":
  //           element.style.cssText = baseStyle + "margin: 6px 0;"
  //           break
  //         case "blockquote":
  //           element.style.cssText =
  //             baseStyle +
  //             "border-left: 4px solid rgb(209, 213, 219); padding-left: 16px; margin: 16px 0; font-style: italic;"
  //           break
  //         default:
  //           element.style.cssText = baseStyle
  //       }

  //       // Process all children
  //       Array.from(element.children).forEach((child) => {
  //         if (child instanceof HTMLElement) {
  //           applyCleanStyles(child)
  //         }
  //       })
  //     }

  //     document.body.appendChild(tempContainer)

  //     // Apply clean styles to all elements
  //     applyCleanStyles(tempContainer)

  //     await new Promise((resolve) => setTimeout(resolve, 100))

  //     const canvas = await html2canvas(tempContainer, {
  //       scale: 2,
  //       useCORS: true,
  //       allowTaint: true,
  //       backgroundColor: "rgb(255, 255, 255)",
  //       logging: false,
  //       onclone: (clonedDoc) => {
  //         const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style')
  //         stylesheets.forEach((sheet) => sheet.remove())
  //       },
  //     })

  //     document.body.removeChild(tempContainer)

  //     const imgData = canvas.toDataURL("image/png")
  //     const pdf = new jsPDF("p", "mm", "a4")

  //     // Calculate dimensions
  //     const pdfWidth = pdf.internal.pageSize.getWidth()
  //     const pdfHeight = pdf.internal.pageSize.getHeight()
  //     const imgWidth = canvas.width
  //     const imgHeight = canvas.height
  //     const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 40) / imgHeight)
  //     const imgX = (pdfWidth - imgWidth * ratio) / 2
  //     const imgY = 20

  //     // Add content to PDF
  //     pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

  //     try {
  //       // Try to load favicon
  //       const faviconImg = new Image()
  //       faviconImg.crossOrigin = "anonymous"

  //       await new Promise<void>((resolve, reject) => {
  //         faviconImg.onload = () => resolve()
  //         faviconImg.onerror = () => reject()
  //         faviconImg.src = "/favicon.ico"
  //       })

  //       // Create gradient background for watermark
  //       const watermarkSize = 80
  //       const watermarkCanvas = document.createElement("canvas")
  //       watermarkCanvas.width = watermarkSize
  //       watermarkCanvas.height = watermarkSize
  //       const ctx = watermarkCanvas.getContext("2d")!

  //       // Create gradient with specified colors
  //       const gradient = ctx.createLinearGradient(0, 0, watermarkSize, watermarkSize)
  //       gradient.addColorStop(0, "#ffb900")
  //       gradient.addColorStop(1, "#fe9a00")

  //       // Draw gradient background
  //       ctx.fillStyle = gradient
  //       ctx.fillRect(0, 0, watermarkSize, watermarkSize)

  //       // Draw favicon on top
  //       ctx.globalAlpha = 0.8
  //       ctx.drawImage(faviconImg, 10, 10, watermarkSize - 20, watermarkSize - 20)

  //       const watermarkData = watermarkCanvas.toDataURL("image/png")

  //       // Add watermark to PDF with low opacity
  //       pdf.setGState(new (pdf as any).GState({ opacity: 0.15 }))

  //       // Add multiple watermarks across the page
  //       for (let x = 50; x < pdfWidth - 50; x += 100) {
  //         for (let y = 50; y < pdfHeight - 50; y += 100) {
  //           pdf.addImage(watermarkData, "PNG", x, y, 30, 30)
  //         }
  //       }

  //       pdf.setGState(new (pdf as any).GState({ opacity: 1 }))
  //     } catch (error) {
  //       // Fallback to text watermark if favicon fails
  //       pdf.setGState(new (pdf as any).GState({ opacity: 0.1 }))
  //       pdf.setFontSize(60)
  //       pdf.setTextColor(255, 185, 0) // #ffb900
  //       pdf.text("Tongston", pdfWidth / 2, pdfHeight / 2, {
  //         angle: 45,
  //         align: "center",
  //       })
  //       pdf.setGState(new (pdf as any).GState({ opacity: 1 }))
  //     }

  //     pdf.save(`${fileName}.pdf`)
  //   } catch (error) {
  //     console.error("Error generating PDF:", error)
  //   } finally {
  //     setIsGenerating(false)
  //   }
  // }

  return (
    <>
      {/* Printable content */}
      <div ref={contentRef}>
        <div
          className="prose w-full
             bg-gradient-to-br from-neutral-200
       via-yellow-50/30 to-amber-50/50
        dark:from-zinc-300 dark:via-orange-400/30
         dark:to-amber-500/10 rounded-md"
          style={{
            color: "#000000",
            padding: "32px",
            marginTop: "16px",
            marginBottom: "8px",
          }}
        >
          <ReactMarkdown
            components={{
              strong: ({ children }) => <strong style={{ fontWeight: "bold", color: "#000000" }}>{children}</strong>,
              table: ({ node, ...props }) => (
                <table
                  style={{
                    border: "1px solid #9ca3af",
                    backgroundColor: "#ffffff",
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  {props.children}
                </table>
              ),
              th: ({ node, ...props }) => (
                <th
                  style={{
                    border: "1px solid #9ca3af",
                    backgroundColor: "#e5e7eb",
                    padding: "8px 16px",
                    fontWeight: "bold",
                    color: "#000000",
                  }}
                >
                  {props.children}
                </th>
              ),
              td: ({ node, ...props }) => (
                <td
                  style={{
                    border: "1px solid #d1d5db",
                    padding: "8px 16px",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {props.children}
                </td>
              ),
              a: ({ node, ...props }) => <a {...props} style={{ color: "#eab308", textDecoration: "underline" }} />,
            }}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {children}
          </ReactMarkdown>
        </div>
      </div>

      {/* Download PDF button */}
      {/* {isButtonEnable && (
        <Button
          onClick={generatePDF}
          className="w-full cursor-pointer mt-4 bg-yellow-400"
          // style={{ backgroundColor: "#eab308", color: "#000000" }}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FaRegFilePdf className="mr-2" />
              Download PDF
            </>
          )}
        </Button>
      )} */}
    </>
  )
}
