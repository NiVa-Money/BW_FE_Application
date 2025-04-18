import { useState, useEffect } from "react";

export default function PulsingGlowLogo({ imageSrc }: { imageSrc: string }) {
  const [pulse, setPulse] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Calculate the pulsing effect using sine wave
  const pulseScale = Math.sin(pulse * 0.06) * 0.15 + 1.1; // Oscillates between 0.95 and 1.25
  const pulseOpacity = Math.sin(pulse * 0.06) * 0.3 + 0.7; // Oscillates between 0.4 and 1.0

  // Add hover scale effect
  const hoverScale = isHovered ? 1.03 : 1;

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative cursor-pointer transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transform: `scale(${hoverScale})` }}
      >
        {/* Outer glow layer */}
        <div
          className="absolute rounded-full bg-purple-500 blur-xl"
          style={{
            top: "50%",
            left: "50%",
            width: "80px",
            height: "80px",
            transform: `translate(-50%, -50%) scale(${pulseScale})`,
            opacity: pulseOpacity,
            zIndex: 0,
          }}
        />

        {/* Black circle container */}
        <div className="relative bg-black hover:bg-purple-950 rounded-full w-20 h-20 flex items-center justify-center z-10">
          {/* Logo image */}
          <img
            src={imageSrc}
            alt="Agent Logo"
            className="w-16 h-16 rounded-full z-20"
          />
        </div>
      </div>
    </div>
  );
}
