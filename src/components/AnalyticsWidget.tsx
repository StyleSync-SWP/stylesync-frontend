import { useState, useEffect } from "react";
import { wardrobeApi } from "../services/wardrobeApi";
import { outfitApi } from "../services/outfitApi";

interface ColorData {
  name: string;
  count: number;
  hex: string;
}

// Color hex mapping for common colors
const colorHexMap: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  gray: "#808080",
  grey: "#808080",
  navy: "#000080",
  blue: "#2563EB",
  red: "#DC2626",
  brown: "#8B4513",
  beige: "#F5F5DC",
  green: "#16A34A",
  yellow: "#EAB308",
  pink: "#EC4899",
  purple: "#9333EA",
  orange: "#F97316",
  // Additional colors
  khaki: "#C3B091",
  teal: "#0F766E",
  charcoal: "#36454F",
  cream: "#FFFDD0",
  blush: "#F4C2C2",
  indigo: "#4B0082",
  mint: "#98FF98",
  terracotta: "#E2725B",
  peach: "#FFCBA4",
  olive: "#808000",
  burgundy: "#800020",
};

// Color Pie Chart Component
function ColorPieChart({ colors }: { colors: ColorData[] }) {
  const total = colors.reduce((sum, c) => sum + c.count, 0);
  let cumulativePercent = 0;

  const segments = colors.map((c) => {
    // Guard against divide-by-zero and clamp each slice to a valid 0-100% range
    const rawPercent = total > 0 ? (c.count / total) * 100 : 0;
    const percent = Math.min(100, Math.max(0, rawPercent));
    const start = cumulativePercent;
    cumulativePercent += percent;
    return { ...c, percent, start };
  });

  return (
    <div className="flex items-center justify-between h-full">
      <svg viewBox="0 0 40 40" className="w-20 h-20 -rotate-90">
        {segments.map((segment, i) => {
          const startAngle = (segment.start / 100) * 360;
          const endAngle = ((segment.start + segment.percent) / 100) * 360;
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = 20 + 15 * Math.cos(startRad);
          const y1 = 20 + 15 * Math.sin(startRad);
          const x2 = 20 + 15 * Math.cos(endRad);
          const y2 = 20 + 15 * Math.sin(endRad);

          return (
            <path
              key={i}
              d={`M 20 20 L ${x1} ${y1} A 15 15 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={segment.hex}
              stroke="#fefefe"
              strokeWidth="0.4"
            />
          );
        })}
        <circle cx="20" cy="20" r="20" fill="None" />
      </svg>
      <div className="flex flex-col gap-1">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded border border-white/20"
              style={{ backgroundColor: s.hex }}
            />
            <span className="text-[10px] text-[rgba(245,237,227,0.8)]">
              {s.name}
            </span>
            <span className="text-[10px] text-[rgba(245,237,227,0.5)]">
              {Math.round(s.percent)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mini Gauge Chart - Wardrobe Health
function WardrobeHealthGauge({ percentage }: { percentage: number }) {
  // Clamp to 0-100% in case usage history references items no longer in the wardrobe
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset =
    circumference - (clampedPercentage / 100) * circumference;

  // Color based on health score
  const getColor = (p: number) => {
    if (p >= 80) return "#22c55e"; // green
    if (p >= 60) return "#84cc16"; // lime
    if (p >= 40) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  const color = getColor(clampedPercentage);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg className="w-20 h-20 -rotate-90">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke="rgba(245,237,227,0.1)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={0}
          strokeLinecap="round"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="text-center -mt-14 mb-3">
        <span className="text-lg font-bold text-[#F5EDE3]">
          {clampedPercentage}%
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[9px] text-[rgba(245,237,227,0.6)]">
          {clampedPercentage >= 80
            ? "Excellent"
            : clampedPercentage >= 60
              ? "Good"
              : clampedPercentage >= 40
                ? "Fair"
                : "Needs Work"}
        </span>
      </div>
      <p className="text-[8px] text-[rgba(245,237,227,0.4)] mt-2 text-center px-2">
        {clampedPercentage}% of total clothes are suggested
      </p>
    </div>
  );
}

export default function AnalyticsWidget() {
  const [colorData, setColorData] = useState<ColorData[]>([]);
  const [wardrobeHealth, setWardrobeHealth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch wardrobe and outfit history
        const [wardrobeData, outfitHistory] = await Promise.all([
          wardrobeApi.getWardrobe(),
          outfitApi.getHistory().catch(() => []),
        ]);

        // Process color distribution from wardrobe
        const colorCounts: Record<string, number> = {};
        wardrobeData.forEach((item: any) => {
          const color = item.color?.toLowerCase() || "unknown";
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        });

        const colors: ColorData[] = Object.entries(colorCounts)
          .map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count,
            hex: colorHexMap[name.toLowerCase()] || "#666666",
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 colors

        setColorData(colors);

        // Calculate wardrobe health based on outfit usage
        const uniqueItemsUsed = new Set();
        outfitHistory.forEach((outfit: any) => {
          if (outfit.garment_ids) {
            outfit.garment_ids.forEach((id: string) => uniqueItemsUsed.add(id));
          }
        });

        // Clamp to 0-100: usage history can reference garment ids that
        // no longer exist in the current wardrobe, which would otherwise
        // push this ratio above 100%.
        const rawHealthPercentage =
          wardrobeData.length > 0
            ? (uniqueItemsUsed.size / wardrobeData.length) * 100
            : 0;
        const healthPercentage = Math.min(
          100,
          Math.max(0, Math.round(rawHealthPercentage)),
        );

        setWardrobeHealth(healthPercentage);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#F5EDE3]">
        <p className="text-sm">Loading your analytics...</p>
      </div>
    );
  }

  if (colorData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#F5EDE3] text-center p-4">
        <p className="text-sm font-serif font-medium mb-2">
          Upload clothes to see more data
        </p>
        <p className="text-xs text-[rgba(245,237,227,0.5)]">
          Add items to your wardrobe to unlock color and usage insights
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-2">
      {/* Header */}
      <div className="flex items-center justify-center mb-1">
        <h3 className="text-2xl font-bold font-serif text-[#F5EDE3]">
          Style Analytics
        </h3>
      </div>

      {/* Text about features */}
      <p className="text-xs text-[rgba(245,237,227,0.5)] text-center mb-3">
        Use our features to learn more about your data
      </p>

      {/* Two Graphs Side by Side */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {/* Graph 1: Color Pie Chart */}
        <div className="bg-[rgba(196,162,101,0.08)] border border-[rgba(196,162,101,0.14)] rounded-xl p-3 flex flex-col items-center">
          <h4 className="text-[11px] text-[#C4A265] uppercase tracking-wide mb-2">
            Wardrobe Colors
          </h4>
          <div className="flex-1">
            <ColorPieChart colors={colorData} />
          </div>
        </div>

        {/* Graph 2: Wardrobe Health Gauge */}
        <div className="bg-[rgba(196,162,101,0.08)] border border-[rgba(196,162,101,0.14)] rounded-xl p-3 flex flex-col items-center">
          <h4 className="text-[11px] text-[#C4A265] uppercase tracking-wide mb-2">
            Wardrobe Health
          </h4>
          <div className="flex-1">
            <WardrobeHealthGauge percentage={wardrobeHealth} />
          </div>
        </div>
      </div>
    </div>
  );
}
