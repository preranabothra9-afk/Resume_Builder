import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Eye, Download, Globe, TrendingUp } from "lucide-react";

const ResumeAnalytics = ({ analytics }) => {

  if (!analytics) return null;

  const countryData = Object.values(
    (analytics.viewHistory || []).reduce((acc, view) => {
      if (!acc[view.country]) {
        acc[view.country] = { country: view.country, views: 0 };
      }
      acc[view.country].views += 1;
      return acc;
    }, {})
  );

  const stats = [
    { label: "Views", value: analytics.views || 0, icon: Eye, gradient: "from-violet-600 to-fuchsia-600" },
    { label: "Downloads", value: analytics.downloads || 0, icon: Download, gradient: "from-cyan-600 to-blue-600" },
    { label: "Countries", value: new Set((analytics.viewHistory || []).map(v => v.country)).size, icon: Globe, gradient: "from-amber-600 to-orange-600" },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-6">
        <TrendingUp className="size-5 text-white/40" />
        <h2 className="text-lg font-semibold text-white">Resume Analytics</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className={`inline-flex size-8 rounded-lg bg-gradient-to-br ${stat.gradient} items-center justify-center mb-3`}>
                <Icon className="size-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {countryData.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-white/70 mb-4">Views by Country</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryData}>
              <XAxis dataKey="country" tick={{ fill: '#ffffff40', fontSize: 12 }} axisLine={{ stroke: '#ffffff10' }} tickLine={false} />
              <YAxis tick={{ fill: '#ffffff40', fontSize: 12 }} axisLine={{ stroke: '#ffffff10' }} tickLine={false} />
              <Tooltip contentStyle={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="views" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {countryData.length === 0 && (
        <div className="text-center py-8 text-white/20">
          <Globe className="size-8 mx-auto mb-2 text-white/10" />
          <p className="text-sm text-white/30">No analytics data yet</p>
          <p className="text-xs mt-1">Share your resume to start tracking.</p>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalytics;
