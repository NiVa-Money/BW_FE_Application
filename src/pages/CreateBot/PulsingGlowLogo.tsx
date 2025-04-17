import { useState, useEffect } from "react";

export default function PulsingGlowLogo() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Calculate the pulsing effect using sine wave
  const pulseScale = Math.sin(pulse * 0.06) * 0.15 + 1.1; // Oscillates between 0.95 and 1.25
  const pulseOpacity = Math.sin(pulse * 0.06) * 0.3 + 0.7; // Oscillates between 0.4 and 1.0

  return (
    <div className="flex items-center justify-center ">
      <div className="relative">
        {/* Outer glow layer */}
        <div
          className="absolute rounded-full bg-purple-600 blur-xl"
          style={{
            top: "50%",
            left: "50%",
            width: "120px",
            height: "120px",
            transform: `translate(-50%, -50%) scale(${pulseScale})`,
            opacity: pulseOpacity,
            zIndex: 0,
          }}
        />

        {/* Black circle container */}
        <div className="relative bg-black rounded-full w-24 h-24 flex items-center justify-center z-10">
          {/* Logo image */}
          <img
            src="/api/placeholder/80/80"
            alt="Growth Logo"
            className="w-20 h-20 rounded-full z-20"
          />
        </div>
      </div>
    </div>
  );
}
