import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export default function FloatingParticles() {
  const { nightMode, festival } = useTheme();

  const particles = useMemo(() => {
    const count = 15;
    const items = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 4;
      let color;
      if (festival === "diwali") {
        color = ["#FFD700", "#FF6F00", "#FF5722", "#FFC107"][Math.floor(Math.random() * 4)];
      } else if (festival === "holi") {
        color = ["#E91E63", "#9C27B0", "#4CAF50", "#2196F3", "#FF9800"][Math.floor(Math.random() * 5)];
      } else if (nightMode) {
        color = ["#FFB74D", "#FF8A65", "#FFCC80"][Math.floor(Math.random() * 3)];
      } else {
        color = ["#FFB74D", "#FF6F61", "#E91E63", "#FFD700"][Math.floor(Math.random() * 4)];
      }

      items.push({
        id: i,
        left: `${Math.random() * 100}%`,
        size,
        color,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
        opacity: 0.3 + Math.random() * 0.3,
      });
    }
    return items;
  }, [nightMode, festival]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
