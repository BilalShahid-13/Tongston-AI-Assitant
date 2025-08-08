import { useState } from "react"
import DescriptionWithDialog from "./descriptionWithDialog"
import { Dialog } from "./ui/dialog"

interface IMyFilesCard {
  text: string | undefined
  des: string | undefined
}

export default function MyFilesCard({ text, des }: IMyFilesCard) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const splitText = text?.split(" ")
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="bg-card h-[300px] text-card-foreground flex flex-row gap-6 rounded-xl border shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-[30%] h-full relative overflow-hidden">
          {/* Background animation layers */}
          <div
            className={`absolute inset-0 bg-yellow-300 transition-transform duration-500 ease-out ${isHovered ? 'transform rotate-45 scale-105' : ''
              }`}
          />

          {/* Top half animation */}
          <div
            className={`absolute top-0 left-0 w-full bg-gradient-to-b from-yellow-400 to-yellow-500 transition-all duration-700 ease-out ${isHovered ? 'h-1/2' : 'h-0'
              }`}
          />

          {/* Bottom half animation */}
          <div
            className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-yellow-400 to-yellow-500 transition-all duration-700 ease-out ${isHovered ? 'h-1/2' : 'h-0'
              }`}
          />

          {/* Text content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center p-4 gap-2">
            {splitText?.map((word, index) => (
              <div
                key={index}
                className={`italic text-4xl transition-all
                duration-500 ease-out
                font-semibold leading-snug tracking-wide
                transform ${isHovered
                    ? 'text-white scale-110 rotate-1'
                    : 'text-black scale-100 rotate-0'
                  }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-center"
        >
          <DescriptionWithDialog des={des || ""}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </Dialog>
  )
}
