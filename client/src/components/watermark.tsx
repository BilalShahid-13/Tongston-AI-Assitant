export default function Watermark({
  textSize,
  imageSize,
}: {
  textSize?: string;
  imageSize?: string;
}) {
  return (
    <div
      id="lesson-watermark"
      className="inset-0 z-0 flex flex-col justify-center items-center pointer-events-none select-none opacity-25"
    >
      <img
        src="/favicon.ico"
        alt="Watermark icon"
        style={{
          width: imageSize || "20vw", // scales with viewport width
          height: "auto",             // keeps proportion
          objectFit: "contain",
        }}
        className="transition-all duration-500"
      />
      <p
        style={{
          fontSize: textSize || "10rem",
        }}
        className="font-bold text-[var(--k12-tertiary)] mt-4 text-center"
      >
        Tongston
      </p>
    </div>
  );
}
