import logo from "../../logo.svg";

export default function SplashImage() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative flex items-center justify-center size-44">
        <div className="absolute animate-[spin_20s_linear_infinite] rounded-full border-2 border-dashed border-primary/20 dark:border-white/10 size-44" />
        <div className="absolute animate-[spin_15s_linear_infinite_reverse] rounded-full border border-primary/10 dark:border-white/5 size-36" />
        <div className="flex items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary shadow-xl shadow-primary/25 size-24">
          <img src={logo} className="w-15" alt="Al Quran" />
        </div>
        {[0, 72, 144, 216, 288].map((rotation) => (
          <div
            key={rotation}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 dark:bg-white/20"
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-60px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
