import { memo } from "react";

interface VinylDiscProps {
  isPlaying: boolean;
  size?: "sm" | "lg";
}

function VinylDisc({ isPlaying, size = "sm" }: VinylDiscProps) {
  const isLarge = size === "lg";

  const spinClass = isPlaying
    ? isLarge
      ? "animate-[spin_8s_linear_infinite]"
      : "animate-[spin_4s_linear_infinite]"
    : "";

  const grooveSizes = isLarge
    ? [95, 89, 83, 77, 71, 65, 59, 53, 47]
    : [88, 78, 68, 58];

  return (
    <div className={`relative shrink-0 ${isLarge ? "h-64 w-64" : "h-12 w-12"}`}>
      <div
        className={`h-full w-full rounded-full bg-black ${spinClass}`}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #333, #111 40%, #000 70%)",
          boxShadow: isLarge
            ? "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {grooveSizes.map((pct) => (
          <div
            key={pct}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${pct}%`,
              height: `${pct}%`,
              border: "0.5px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-secondary to-primary"
          style={{
            width: isLarge ? "34%" : "42%",
            height: isLarge ? "34%" : "42%",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="rounded-full bg-white/90"
              style={{
                width: isLarge ? "14%" : "20%",
                height: isLarge ? "14%" : "20%",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          {isLarge && (
            <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: isLarge
            ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.3) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

export default memo(VinylDisc);
