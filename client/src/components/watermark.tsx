
export default function Watermark({ textSize, imageSize }: { textSize?: string; imageSize?: string }) {
  return (
    <>
      <div className="pointer-events-none opacity-15
              select-none text-4xl flex justify-center items-center text-center flex-col
               font-bold whitespace-pre-wrap"
      style={{ transform: "rotate(-30deg)" }}
      >
        <img src="/favicon.ico"
          style={{
            width: imageSize,
            height: imageSize
          }}
          className="w-12 h-12" />
        <p style={{
          fontSize: textSize
        }} className="text-[var(--k12-tertiary)]">Tongston</p>
        {/* {`Tongston • ${`user.name`} • ${`user.email`} • ${new Date().toLocaleString()}`} */}
      </div>
    </>
  )
}
