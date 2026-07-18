import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Eye, Download, Globe, TrendingUp, TrendingDown, Clock, MapPin } from "lucide-react";

const TooltipContent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tooltip border border-theme-medium rounded-xl px-3 py-2 shadow-xl">
        <p className="text-muted text-xs mb-1">{label}</p>
        <p className="text-primary text-sm font-semibold">{payload[0].value} view{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const CountryTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tooltip border border-theme-medium rounded-xl px-3 py-2 shadow-xl">
        <p className="text-muted text-xs mb-1">{label}</p>
        <p className="text-primary text-sm font-semibold">{payload[0].value} view{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const ResumeAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  const viewHistory = analytics.viewHistory || [];

  const countryData = Object.values(
    viewHistory.reduce((acc, view) => {
      const country = view.country || "Unknown";
      if (!acc[country]) {
        acc[country] = { country, views: 0 };
      }
      acc[country].views += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.views - a.views);

  const viewsOverTime = Object.values(
    viewHistory.reduce((acc, view) => {
      const d = new Date(view.date);
      const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!acc[date]) {
        acc[date] = { date, views: 0, sortKey: d.getTime() };
      }
      acc[date].views += 1;
      return acc;
    }, {})
  ).sort((a, b) => a.sortKey - b.sortKey);

  const recentViews = [...viewHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const totalViews = analytics.views || 0;
  const totalDownloads = analytics.downloads || 0;
  const totalCountries = new Set(viewHistory.map(v => v.country || "Unknown")).size;

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  const lastWeekViews = viewHistory.filter(v => new Date(v.date).getTime() >= weekAgo).length;
  const prevWeekViews = viewHistory.filter(v => {
    const t = new Date(v.date).getTime();
    return t >= twoWeeksAgo && t < weekAgo;
  }).length;

  const trendPercent = prevWeekViews > 0
    ? Math.round(((lastWeekViews - prevWeekViews) / prevWeekViews) * 100)
    : lastWeekViews > 0 ? 100 : 0;

  const stats = [
    {
      label: "Total Views",
      value: totalViews,
      icon: Eye,
      gradient: "from-violet-600 to-fuchsia-600",
      trend: trendPercent,
      arrow: trendPercent >= 0 ? TrendingUp : TrendingDown,
      arrowColor: trendPercent >= 0 ? "text-emerald-400" : "text-rose-400",
      subtitle: `${lastWeekViews} this week`
    },
    {
      label: "Downloads",
      value: totalDownloads,
      icon: Download,
      gradient: "from-cyan-600 to-blue-600",
      subtitle: "All time"
    },
    {
      label: "Countries",
      value: totalCountries,
      icon: Globe,
      gradient: "from-amber-600 to-orange-600",
      subtitle: `From ${viewHistory.length} view${viewHistory.length !== 1 ? 's' : ''}`
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-6">
        <TrendingUp className="size-5 text-subtle" />
        <h2 className="text-lg font-semibold text-primary">Resume Analytics</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Arrow = stat.arrow;
          return (
            <div key={stat.label} className="rounded-xl bg-glass-3 border border-theme-light p-4 hover-bg-glass-5 transition-colors">
              <div className={`inline-flex size-8 rounded-lg bg-gradient-to-br ${stat.gradient} items-center justify-center mb-3`}>
                <Icon className="size-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs text-subtle">{stat.label}</p>
                {Arrow && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${stat.arrowColor}`}>
                    <Arrow className="size-3" />
                    {stat.trend}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {viewHistory.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-muted mb-4">Views Over Time</h3>
              <div className="rounded-xl bg-glass-2 border border-theme-light p-4">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={viewsOverTime}>
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "var(--text-faint)", fontSize: 11 }}
                      axisLine={{ stroke: "var(--border-light)" }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: "var(--text-faint)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<TooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fill="url(#viewsGradient)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#8B5CF6", stroke: "var(--bg-tooltip)", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-muted mb-4">Views by Country</h3>
              <div className="rounded-xl bg-glass-2 border border-theme-light p-4">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={countryData} layout="vertical">
                    <XAxis type="number" tick={{ fill: "var(--text-faint)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="country" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip content={<CountryTooltip />} />
                    <Bar dataKey="views" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {recentViews.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted mb-4">Recent Views</h3>
              <div className="space-y-1.5">
                {recentViews.map((view, i) => {
                  const date = new Date(view.date);
                  const timeAgo = getTimeAgo(date);
                  return (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-glass-2 border border-theme-light hover-bg-glass-4 transition-colors">
                      <div className="size-7 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                        <MapPin className="size-3 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-body font-medium truncate">{view.country || "Unknown"}</p>
                        <p className="text-xs text-faint">{timeAgo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {viewHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex size-14 rounded-xl bg-glass-3 border border-theme-light items-center justify-center mb-4">
            <Eye className="size-6 text-hidden" />
          </div>
          <p className="text-subtle font-medium text-sm">No views yet</p>
          <p className="text-faint text-xs mt-1 max-w-xs mx-auto">
            {analytics.public
              ? "Share your resume link to start getting views."
              : "Make your resume public to start tracking views."
            }
          </p>
        </div>
      )}
    </div>
  );
};

function getTimeAgo(date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default ResumeAnalytics;
