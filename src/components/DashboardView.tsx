import { 
  Zap, Calendar, Share2, ArrowUpRight, Clock, 
  Send, Sparkles, Plus, CheckCircle, Video, Image as ImageIcon 
} from 'lucide-react';
import { PlanConfig, SocialAccount, PostItem } from '../types';

interface DashboardViewProps {
  currentPlan: PlanConfig;
  accounts: SocialAccount[];
  posts: PostItem[];
  onNavigate: (page: string) => void;
  onPublishNow: (post: PostItem) => void;
  onOpenPricing: () => void;
}

export default function DashboardView({
  currentPlan,
  accounts,
  posts,
  onNavigate,
  onPublishNow,
  onOpenPricing,
}: DashboardViewProps) {
  const connectedAccounts = accounts.filter((a) => a.connected);
  const scheduledPosts = posts.filter((p) => p.status === 'scheduled');
  const publishedPosts = posts.filter((p) => p.status === 'published');

  const totalFollowersReached = '118.8K';
  const totalPostsUsed = publishedPosts.length + scheduledPosts.length;
  const postsLimitDisplay = currentPlan.postsLimit === 999999 ? 'Unlimited' : currentPlan.postsLimit;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950/40 to-neutral-900 border border-neutral-800 p-5 sm:p-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Platform Auto-Publish Engine Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome to PostFlow AI Studio
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Distribute content across YouTube, Instagram, X, LinkedIn, Facebook, and Pinterest with zero manual re-uploading.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('studio')}
              className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Create AI Post</span>
            </button>
            <button
              onClick={() => onNavigate('schedule')}
              className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer border border-neutral-700/60"
            >
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>View Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Connected Channels</span>
            <Share2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {connectedAccounts.length}
            <span className="text-xs text-neutral-500 font-normal ml-1">
              / {currentPlan.platformsLimit === 999 ? '∞' : currentPlan.platformsLimit} max
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{connectedAccounts.length} syncing regularly</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Monthly Post Quota</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {totalPostsUsed}
            <span className="text-xs text-neutral-500 font-normal ml-1">/ {postsLimitDisplay}</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>{scheduledPosts.length} queued</span>
            <button
              onClick={onOpenPricing}
              className="text-indigo-400 hover:text-indigo-300 underline font-sans cursor-pointer"
            >
              Raise limit
            </button>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Audience Network</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {totalFollowersReached}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>+12.4%</span>
            <span className="text-neutral-500 font-sans">this month</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Current Plan</span>
            <span className="text-[10px] font-mono uppercase text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
              Active
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white capitalize">
            {currentPlan.name}
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>₹{currentPlan.priceMonthly}/mo</span>
            <button
              onClick={onOpenPricing}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Switch Plan →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split: Queued Posts & Channel Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scheduled Queue & Immediate Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Upcoming Scheduled Queue</h2>
              <p className="text-xs text-neutral-400">Posts configured for automated cloud publishing</p>
            </div>
            <button
              onClick={() => onNavigate('studio')}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-200 border border-neutral-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Schedule New</span>
            </button>
          </div>

          <div className="space-y-3">
            {posts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/90 hover:border-neutral-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Media Thumbnail */}
                  {post.mediaUrl ? (
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 relative">
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      {post.mediaType === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-neutral-800/60 border border-neutral-700/40 flex items-center justify-center text-neutral-500 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-indigo-400 uppercase">
                        {post.status}
                      </span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {post.scheduledDate} at {post.scheduledTime}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate mb-1">
                      {post.title}
                    </h4>

                    {/* Platform icons */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <span>Destinations:</span>
                      <div className="flex items-center gap-1">
                        {post.platforms.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-800 text-neutral-300 uppercase font-mono"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  {post.status === 'scheduled' && (
                    <button
                      onClick={() => onPublishNow(post)}
                      className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      title="Publish immediately without waiting for schedule"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Now</span>
                    </button>
                  )}
                  {post.status === 'published' && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Live on Feed</span>
                    </span>
                  )}
                  {post.status === 'draft' && (
                    <button
                      onClick={() => onNavigate('studio')}
                      className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer"
                    >
                      Edit Draft
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('schedule')}
            className="w-full py-2.5 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800/60 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-center"
          >
            Open Full Calendar & Publishing Timeline →
          </button>
        </div>

        {/* Right: Social Platforms Hub (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Connected Channels</h2>
            <button
              onClick={() => onNavigate('accounts')}
              className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Manage ({connectedAccounts.length}/6)
            </button>
          </div>

          <div className="space-y-2.5">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate">{acc.name}</h5>
                    <p className="text-[11px] text-neutral-400 truncate">{acc.handle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {acc.connected ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Sync</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigate('accounts')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/30 text-xs text-neutral-300 space-y-1.5">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Cross-Posting Enabled</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              When scheduling a post, PostFlow AI automatically formats aspect ratios and hashtag limits per platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
