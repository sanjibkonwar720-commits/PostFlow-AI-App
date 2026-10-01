import { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, ArrowUpRight, 
  Download, FileText, Sparkles, Clock, Globe 
} from 'lucide-react';
import { PlanConfig } from '../types';

interface AnalyticsViewProps {
  currentPlan: PlanConfig;
  onOpenPricing: () => void;
  showToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
}

export default function AnalyticsView({
  currentPlan,
  onOpenPricing,
  showToast,
}: AnalyticsViewProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isExporting, setIsExporting] = useState(false);

  const canExportPdf = currentPlan.id === 'ultimate' || currentPlan.id === 'premium';

  const handleExport = (format: 'pdf' | 'csv') => {
    if (format === 'pdf' && !canExportPdf) {
      showToast('PDF Export Restriction', 'Comprehensive PDF executive reports require Premium or Ultimate plan.', 'info');
      onOpenPricing();
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(
        `Report Downloaded (${format.toUpperCase()})`,
        `PostFlow_Analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.${format}`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Analytics & Intelligence</span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              Level: {currentPlan.analyticsLevel}
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time cross-channel metrics aggregating views, saves, retweets, and follower conversions.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="py-2 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
            {!canExportPdf && <Sparkles className="w-3 h-3 text-amber-400 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-neutral-900/60 rounded-xl border border-neutral-800">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                timeRange === r
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Last {r.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-500 font-mono">
          Last synced: <span className="text-neutral-400">2 minutes ago</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Total Impressions</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">482,910</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs prev period</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Average Engagement</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">6.42%</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+2.1% benchmark</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Link Clicks & Bio Taps</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">14,280</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+9.6% conversions</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Optimal Time Slot</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">6:30 PM</div>
          <div className="mt-2 text-[11px] text-neutral-400">
            IST (Peak Engagement)
          </div>
        </div>
      </div>

      {/* Chart: Reach per Platform Breakdown */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Audience Reach Distribution by Platform</h3>
            <p className="text-xs text-neutral-400">Comparative views across all linked accounts</p>
          </div>
          <BarChart3 className="w-4 h-4 text-indigo-400" />
        </div>

        {/* Realistic Horizontal Bar Chart */}
        <div className="space-y-3 pt-2">
          {[
            { platform: 'YouTube (Shorts & Videos)', reach: '184,200', pct: 85, color: 'bg-red-500' },
            { platform: 'Instagram (Reels & Carousels)', reach: '142,500', pct: 68, color: 'bg-pink-500' },
            { platform: 'LinkedIn (Posts & Articles)', reach: '89,400', pct: 45, color: 'bg-blue-500' },
            { platform: 'X / Twitter (Threads & Takes)', reach: '42,100', pct: 28, color: 'bg-neutral-300' },
            { platform: 'Facebook & Pinterest', reach: '24,710', pct: 18, color: 'bg-indigo-400' },
          ].map((item) => (
            <div key={item.platform} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300">{item.platform}</span>
                <span className="text-neutral-400 font-bold">{item.reach} views</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Posting Times Heatmap */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-bold text-white">Best Times to Auto-Publish (Heatmap)</h3>
        <p className="text-xs text-neutral-400">Based on historical followers online active state</p>

        <div className="grid grid-cols-7 gap-1.5 text-center pt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="space-y-1">
              <span className="text-[11px] font-mono text-neutral-500">{day}</span>
              <div className="space-y-1">
                <div className={`h-8 rounded ${idx === 1 || idx === 3 ? 'bg-indigo-600/90' : 'bg-indigo-950/40'} flex items-center justify-center text-[10px] text-white font-mono`}>
                  9 AM
                </div>
                <div className={`h-8 rounded ${idx >= 2 && idx <= 5 ? 'bg-indigo-500' : 'bg-indigo-950/50'} flex items-center justify-center text-[10px] text-white font-mono`}>
                  2 PM
                </div>
                <div className={`h-8 rounded bg-cyan-500/90 flex items-center justify-center text-[10px] text-neutral-950 font-bold font-mono`}>
                  6:30 PM ★
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
