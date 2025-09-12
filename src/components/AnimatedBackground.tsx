import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

export default function AnimatedBackground() {
  const [animationData, setAnimationData] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/animations/tree.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => {
        // Silently fail; background is decorative
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Spawn a leaf element at x,y with randomized drift
  const spawnLeafAt = (x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return;
    const wrapper = document.createElement("div");
    wrapper.className = "leaf-trail";
    const dx = (Math.random() * 80 - 40).toFixed(0);
    const dy = (Math.random() * -120 - 40).toFixed(0);
    const rot = (Math.random() * 60 - 30).toFixed(0);
    wrapper.style.setProperty("--dx", `${dx}px`);
    wrapper.style.setProperty("--dy", `${dy}px`);
    wrapper.style.setProperty("--rot", `${rot}deg`);
    wrapper.style.left = `${x}px`;
    wrapper.style.top = `${y}px`;

    const colors = ["#22c55e", "#16a34a", "#0ea5e9", "#f59e0b", "#10b981"];
    const fill = colors[Math.floor(Math.random() * colors.length)];
    const size = 28 + Math.floor(Math.random() * 10); // 28-38px
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", `${size}`);
    svg.setAttribute("height", `${size}`);
    svg.setAttribute("aria-hidden", "true");
    svg.style.display = "block";
    svg.style.filter = "none";
    svg.style.transform = "translateZ(0)";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // Simple leaf path
    path.setAttribute("d", "M12 2c3 3 7 6 7 10a7 7 0 1 1-14 0c0-4 4-7 7-10Zm-1 9c-1 2-3 4-5 5 3-1 5-3 6-5 1-2 2-4 5-6-2 3-4 4-6 6Z");
    path.setAttribute("fill", fill);
    path.setAttribute("shape-rendering", "geometricPrecision");
    svg.appendChild(path);

    wrapper.appendChild(svg);
    container.appendChild(wrapper);
    wrapper.addEventListener("animationend", () => wrapper.remove());
  };

  // Cursor trail handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let lastTime = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < 70) return; // throttle ~14/sec
      lastTime = now;
      const rect = container.getBoundingClientRect();
      spawnLeafAt(e.clientX - rect.left, e.clientY - rect.top);
    };
    container.addEventListener("mousemove", onMove);
    return () => container.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 via-blue-100/30 to-blue-200/40" />

      {/* Floating color orbs - bigger and more vivid */}
      <div className="orb w-[44rem] h-[44rem] left-[-12rem] top-[6%] bg-green-300/70" style={{ animationDuration: "8s" }} />
      <div className="orb orb-delayed w-[36rem] h-[36rem] right-[-10rem] bottom-[8%] bg-blue-300/70" style={{ animationDuration: "7s" }} />
      <div className="orb w-[28rem] h-[28rem] left-[55%] top-[-6rem] bg-emerald-200/70" style={{ animationDuration: "9s" }} />

      {/* Drifting leaves layer - more leaves */}
      <div className="absolute inset-0 z-[3] opacity-90">
        {Array.from({ length: 30 }).map((_, i) => {
          const left = `${5 + Math.random() * 90}%`;
          const top = `${10 + Math.random() * 70}%`;
          const sizes = ["text-5xl", "text-6xl", "text-7xl"] as const;
          const size = sizes[i % sizes.length];
          const duration = 9 + Math.random() * 8; // 9s - 17s
          const emojis = ["🍃", "🍂", "🍀", "🍁"];
          const emoji = emojis[i % emojis.length];
          return (
            <div
              key={i}
              className={`drift absolute select-none ${size}`}
              style={{ left, top, animationDuration: `${duration}s` }}
            >
              {emoji}
            </div>
          );
        })}
      </div>

      {/* Multiple Lottie trees - varied positions/scales for depth */}
      {animationData && (
        <>
          <div className="absolute bottom-[-10%] left-[-10%] scale-[0.8] opacity-50">
            <Lottie animationData={animationData} loop autoplay style={{ width: "70vw", height: "70vh" }} />
          </div>
          <div className="absolute bottom-[-12%] right-[-12%] scale-[0.9] opacity-60">
            <Lottie animationData={animationData} loop autoplay style={{ width: "75vw", height: "75vh" }} />
          </div>
          <div className="absolute bottom-[-8%] left-[15%] scale-[1.1] opacity-80">
            <Lottie animationData={animationData} loop autoplay style={{ width: "80vw", height: "80vh" }} />
          </div>
        </>
      )}

      {/* Overlay for readability - moved below leaves so they stay crisp */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-white/35 to-white/10 backdrop-blur-[2px]" />
    </div>
  );
}
