// ============================================
// REAL IMPLEMENTATION - Fetch data from backend
// ============================================
/*
import { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";

interface ColorData {
  name: string;
  count: number;
  hex: string;
}

interface UsageData {
  day: string;
  outfits: number;
}

interface AnalyticsResponse {
  colors: ColorData[];
  weeklyUsage: UsageData[];
  message: string;
}

export default function AnalyticsWidget() {
  const { user } = useAuthStore();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/users/${user?.id}/analytics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <p className="text-sm">Loading your analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-center p-4">
        <p className="text-lg font-medium mb-2">Use our features to learn more about your data</p>
        <p className="text-sm text-white/60">Create outfits and build your wardrobe to see insights</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <p className="text-sm text-white/80 text-center">{data.message}</p>
      
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-xl p-3">
          <h4 className="text-xs text-white/60 uppercase mb-2">Color Distribution</h4>
          <ColorBarChart colors={data.colors} />
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <h4 className="text-xs text-white/60 uppercase mb-2">Weekly Usage</h4>
          <WeekUsageChart data={data.weeklyUsage} />
        </div>
      </div>
    </div>
  );
}

function ColorBarChart({ colors }: { colors: ColorData[] }) {
  const max = Math.max(...colors.map(c => c.count));
  return (
    <div className="flex flex-col gap-2 h-full justify-center">
      {colors.map((color) => (
        <div key={color.name} className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: color.hex }} />
          <span className="text-xs text-white/70 w-16">{color.name}</span>
          <div className="flex-1 bg-white/10 rounded-full h-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(color.count / max) * 100}%`, backgroundColor: color.hex }}
            />
          </div>
          <span className="text-xs text-white/50 w-6 text-right">{color.count}</span>
        </div>
      ))}
    </div>
  );
}

function WeekUsageChart({ data }: { data: UsageData[] }) {
  const max = Math.max(...data.map(d => d.outfits));
  return (
    <div className="flex items-end justify-between h-full gap-1">
      {data.map((day) => (
        <div key={day.day} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full bg-[#FE7743] rounded-t transition-all duration-500"
            style={{ height: `${(day.outfits / max) * 80}%`, minHeight: "4px" }}
          />
          <span className="text-[10px] text-white/50">{day.day.slice(0, 3)}</span>
        </div>
      ))}
    </div>
  );
}
*/

// ============================================
// DEMO IMPLEMENTATION - Display 2 graphs with demo data
// ============================================

interface ColorData {
  name: string;
  count: number;
  hex: string;
}

// Color Pie Chart Component
function ColorPieChart({ colors }: { colors: ColorData[] }) {
  const total = colors.reduce((sum, c) => sum + c.count, 0);
  let cumulativePercent = 0;

  const segments = colors.map((c) => {
    const percent = (c.count / total) * 100;
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
              strokeWidth="0.7"
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
            <span className="text-[10px] text-white/80">{s.name}</span>
            <span className="text-[10px] text-white/50">
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
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color based on health score
  const getColor = (p: number) => {
    if (p >= 80) return "#22c55e"; // green
    if (p >= 60) return "#84cc16"; // lime
    if (p >= 40) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  const color = getColor(percentage);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg className="w-20 h-20 -rotate-90">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
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
        <span className="text-lg font-bold text-white">{percentage}%</span>
      </div>
      <div className="mt-3 flex items-center gap-1">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[9px] text-white/60">
          {percentage >= 80
            ? "Excellent"
            : percentage >= 60
              ? "Good"
              : percentage >= 40
                ? "Fair"
                : "Needs Work"}
        </span>
      </div>
      <p className="text-[8px] text-white/40 mt-2 text-center px-2">
        {percentage}% of items are suggested/fit well
      </p>
    </div>
  );
}

export default function AnalyticsWidget() {
  // Demo data
  const colorData: ColorData[] = [
    { name: "Black", count: 15, hex: "#1a1a2e" },
    { name: "Navy", count: 10, hex: "#4a4a6a" },
    { name: "Brown", count: 8, hex: "#8B4513" },
    { name: "White", count: 6, hex: "#e8e8e8" },
    { name: "Red", count: 4, hex: "#FE7743" },
  ];

  // Wardrobe health score (demo)
  const wardrobeHealth = 72;

  return (
    <div className="flex flex-col h-full p-2">
      {/* Header */}
      <div className="flex items-center justify-center mb-1">
        <h3 className="text-sm font-bold text-white">Style Analytics</h3>
      </div>

      {/* Text about features */}
      <p className="text-xs text-white/60 text-center mb-3">
        Use our features to learn more about your data
      </p>

      {/* Two Graphs Side by Side */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {/* Graph 1: Color Pie Chart */}
        <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center">
          <h4 className="text-[11px] text-[#ffffff] uppercase tracking-wide mb-2">
            Wardrobe Colors
          </h4>
          <div className="flex-1">
            <ColorPieChart colors={colorData} />
          </div>
        </div>

        {/* Graph 2: Wardrobe Health Gauge */}
        <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center">
          <h4 className="text-[11px] text-[#ffffff] uppercase tracking-wide mb-2">
            Wardrobe Health
          </h4>
          <div className="flex-1">
            <WardrobeHealthGauge percentage={wardrobeHealth} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[9px] text-white/30 text-center mt-3">
        Real analytics with backend integration coming soon
      </p>
    </div>
  );
}
