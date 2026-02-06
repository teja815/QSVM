 import React from "react";
import Particles from "react-tsparticles";

export default function AnimatedBg({ dark }) {
  const lightColors = ["#8b5cf6", "#c084fc", "#a78bfa"];
  const darkColors = ["#06b6d4", "#0891b2", "#0ea5a4"];

  return (
    <Particles
      className="absolute inset-0 -z-10"
      options={{
        fpsLimit: 60,
        background: { color: "transparent" },
        particles: {
          number: { value: 50, density: { enable: true, area: 900 } },
          color: { value: dark ? darkColors : lightColors },
          links: { enable: true, distance: 140, opacity: 0.25 },
          move: { enable: true, speed: 1.2, outModes: "bounce" },
          size: { value: { min: 1, max: 4 } },
          opacity: { value: { min: 0.12, max: 0.8 } },
        },
      }}
    />
  );
}
