import { useState, useEffect } from "react";
import { COLORS } from "../../constants";

export default function PulsingGlowLogo({
  theme,
  imageSrc,
}: {
  theme: string;
  imageSrc: string;
}) {
  const [pulse, setPulse] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // pulsing effect
  const pulseScale = Math.sin(pulse * 0.06) * 0.15 + 1.4; // Oscillates between 1.25 and 1.55
  const pulseOpacity = Math.sin(pulse * 0.06) * 0.3 + 0.3; // Oscillates between 0 and 0.6

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative cursor-pointer transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
      >
        {/* Constant inner glow layer */}
        <div
          className="absolute rounded-full blur-md"
          style={{
            top: "50%",
            left: "50%",
            width: "80px",
            height: "80px",
            backgroundColor: COLORS.LIGHTGREEN,
            transform: "translate(-50%, -50%) scale(1.2)",
            opacity: 0.8,
            zIndex: 0,
          }}
        />

        {/* Outer pulsing glow layer */}
        <div
          className="absolute rounded-full blur-xl"
          style={{
            top: "50%",
            left: "50%",
            width: "80px",
            height: "80px",
            backgroundColor: COLORS.LIGHTGREEN,
            transform: `translate(-50%, -50%) scale(${pulseScale})`,
            opacity: pulseOpacity,
            zIndex: 0,
          }}
        />

        {/* Black circle container */}
        <div
          className="relative rounded-full w-20 h-20 flex items-center justify-center z-10"
          style={{
            backgroundColor: theme === "dark" ? COLORS.BLACK : COLORS.WHITE,
            opacity: isHovered ? 0.9 : 1,
          }}
        >
          {/* Logo Logo */}
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
