export function SceneTitle({
  text,
  fontClass,
}: {
  text: string;
  fontClass: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[22%] z-10 flex justify-center px-4">
      <h1
        className={`${fontClass} text-center text-6xl font-extrabold text-white sm:text-7xl md:text-8xl`}
        style={{
          textShadow:
            "0 2px 4px rgba(0,0,0,0.55), 0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        {text}
      </h1>
    </div>
  );
}
