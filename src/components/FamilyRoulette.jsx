import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePhotos } from "../context/PhotoContext";
import { useMusic } from "../context/MusicContext";
import { familyMembers } from "../data/familyData";

const members = Object.values(familyMembers);
const SEGMENT_ANGLE = 360 / members.length;
const COLORS = ["#E91E63", "#1565C0", "#9C27B0", "#FF6F00"];

export default function FamilyRoulette() {
  const { nightMode } = useTheme();
  const { getRandomPhoto } = usePhotos();
  const { autoPlayForContext } = useMusic();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const randomMemberIdx = Math.floor(Math.random() * members.length);
    // Pointer is at top (270° in SVG coords). Calculate rotation so the correct segment lands under it.
    const segmentCenter = randomMemberIdx * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetAngle = extraSpins * 360 + ((270 - segmentCenter) % 360 + 360) % 360;

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      const member = members[randomMemberIdx];
      const photo = getRandomPhoto({ member: member.id });
      setResult({ member, photo });
      autoPlayForContext(`member:${member.id}`);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-sunset" />
        </div>

        {/* Spinning wheel */}
        <motion.div
          ref={wheelRef}
          className="w-full h-full rounded-full border-4 border-warm-300 shadow-2xl overflow-hidden relative"
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.32, 0.72, 0, 1] }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {members.map((member, i) => {
              const startAngle = i * SEGMENT_ANGLE;
              const endAngle = startAngle + SEGMENT_ANGLE;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 100 + 100 * Math.cos(startRad);
              const y1 = 100 + 100 * Math.sin(startRad);
              const x2 = 100 + 100 * Math.cos(endRad);
              const y2 = 100 + 100 * Math.sin(endRad);
              const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

              const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
              const textX = 100 + 60 * Math.cos(midAngle);
              const textY = 100 + 60 * Math.sin(midAngle);
              const textRotate = (startAngle + endAngle) / 2;

              return (
                <g key={member.id}>
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={COLORS[i]}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    transform={`rotate(${textRotate}, ${textX}, ${textY})`}
                  >
                    {member.emoji}
                  </text>
                  <text
                    x={textX}
                    y={textY + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="7"
                    fontWeight="600"
                    transform={`rotate(${textRotate}, ${textX}, ${textY + 14})`}
                  >
                    {member.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning}
        className={`glow-btn px-8 py-3 rounded-full text-lg font-bold transition-all ${
          spinning ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {spinning ? "Spinning..." : "Spin the Wheel! 🎰"}
      </button>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center p-6 rounded-2xl w-full max-w-sm ${
            nightMode ? "bg-[#2D1810]/80" : "bg-white/80"
          } backdrop-blur-sm shadow-lg`}
        >
          <span className="text-4xl">{result.member.emoji}</span>
          <h3 className={`text-xl font-display font-bold mt-2 ${
            nightMode ? "text-warm-200" : "text-warm-800"
          }`}>
            {result.member.name}!
          </h3>
          <p className={`text-sm mt-1 ${nightMode ? "text-warm-400" : "text-warm-500"}`}>
            {result.member.bio}
          </p>
          {result.photo && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img
                src={result.photo.src}
                alt={result.photo.caption}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {result.photo.caption && (
                <p className={`font-hand text-lg mt-2 ${nightMode ? "text-warm-300" : "text-warm-600"}`}>
                  {result.photo.caption}
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
