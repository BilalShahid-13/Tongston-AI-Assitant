import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // adjust to your path
import { useAnalyticsStore } from "@/store/analyticsStore";
import { motion, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import * as React from "react";

type Variant = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

type StatsCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ElementType; // e.g., Users from lucide-react
  variant?: Variant;
  trend?: { value: number; isUp: boolean; label?: string };
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

const VARIANTS: Record<Variant, {
  icon: string;
  iconBg: string;
  borderGradient: string;
  ring: string;
  focus: string;
}> = {
  blue: { icon: "text-blue-600", iconBg: "bg-blue-50", borderGradient: "from-blue-500/30 via-sky-500/20 to-cyan-500/30", ring: "group-hover:ring-blue-300/40", focus: "focus-visible:ring-blue-400/50" },
  violet: { icon: "text-violet-600", iconBg: "bg-violet-50", borderGradient: "from-violet-500/30 via-fuchsia-500/20 to-purple-500/30", ring: "group-hover:ring-violet-300/40", focus: "focus-visible:ring-violet-400/50" },
  emerald: { icon: "text-emerald-600", iconBg: "bg-emerald-50", borderGradient: "from-emerald-500/30 via-teal-500/20 to-green-500/30", ring: "group-hover:ring-emerald-300/40", focus: "focus-visible:ring-emerald-400/50" },
  amber: { icon: "text-amber-600", iconBg: "bg-amber-50", borderGradient: "from-amber-500/30 via-orange-500/20 to-yellow-500/30", ring: "group-hover:ring-amber-300/40", focus: "focus-visible:ring-amber-400/50" },
  rose: { icon: "text-rose-600", iconBg: "bg-rose-50", borderGradient: "from-rose-500/30 via-pink-500/20 to-rose-500/30", ring: "group-hover:ring-rose-300/40", focus: "focus-visible:ring-rose-400/50" },
  slate: { icon: "text-slate-600", iconBg: "bg-slate-50", borderGradient: "from-slate-500/30 via-gray-500/20 to-zinc-500/30", ring: "group-hover:ring-slate-300/40", focus: "focus-visible:ring-slate-400/50" },
};

// Optional animated number for nicer value changes
function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(Number(value) || 0, { stiffness: 80, damping: 18, mass: 0.6 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => { spring.set(Number(value) || 0); }, [value]); // update when value changes
  React.useEffect(() => spring.on("change", (v) => setDisplay(v)), []); // subscribe

  return <>{Math.round(display).toLocaleString()}</>;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "blue",
  trend,
  loading,
  onClick,
  className = "",
  children,
}: StatsCardProps) {
  const v = VARIANTS[variant];
  const { analyticsData } = useAnalyticsStore()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`group relative ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      {/* Soft gradient glow */}
      <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${v.borderGradient} opacity-60 blur-[18px] transition-opacity duration-500 group-hover:opacity-90`} />

      <Card
        className={[
          "relative rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-md",
          "shadow-sm transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-lg",
          "ring-1 ring-inset ring-black/5", v.ring, v.focus
        ].join(" ")}
      >
        {/* Subtle shine on hover */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -inset-x-16 -top-24 h-40 rotate-12 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </div>

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
          <div className="flex flex-col justify-end items-center gap-3">
            {Icon ? (
              <div className={`h-10 w-10 grid place-items-center rounded-xl ${v.iconBg}`}>
                <Icon className={`h-5 w-5 ${v.icon}`} />
              </div>
            ) : null}
            {children && <div>{children}</div>}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-gray-900">
              {loading ? (
                <span className="inline-block h-8 w-32 animate-pulse rounded-md bg-gray-200/70" />
              ) : typeof value === "number" ? (
                <AnimatedNumber value={value} />
              ) : (
                value
              )}
            </div>

            {trend && !loading ? (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend.isUp ? "text-emerald-600" : "text-rose-600"}`}>
                {trend.isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            ) : null}
          </div>

          {description ? <p className="text-xs text-gray-500">{description}</p> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}