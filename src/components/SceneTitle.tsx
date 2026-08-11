export function SceneTitle({
  text,
  fontClass,
  subtitle,
}: {
  text: string;
  fontClass: string;
  subtitle?: string;
}) {
  const textShadow = {
    textShadow: "0 2px 4px rgba(0,0,0,0.55), 0 8px 30px rgba(0,0,0,0.4)",
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[22%] z-10 flex flex-col items-center gap-1 px-4">
      <h1
        className={`${fontClass} text-center text-6xl font-extrabold text-white sm:text-7xl md:text-8xl`}
        style={textShadow}
      >
        {text}
      </h1>
      {subtitle && (
        <span
          className={`${fontClass} text-center text-sm font-medium text-white/70 sm:text-base`}
          style={textShadow}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
