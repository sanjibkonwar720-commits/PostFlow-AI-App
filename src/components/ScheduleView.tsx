import { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Send, Plus, 
  CheckCircle2, ChevronLeft, ChevronRight, Video, 
  Image as ImageIcon, Trash2 
} from 'lucide-react';
import { PostItem, SocialPlatformId } from '../types';

interface ScheduleViewProps {
  posts: PostItem[];
  onPublishNow: (post: PostItem) => void;
  onDeletePost: (id: string) => void;
  onNavigateToStudio: () => void;
}

export default function ScheduleView({
  posts,
  onPublishNow,
  onDeletePost,
  onNavigateToStudio,
}: ScheduleViewProps) {
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // October (0-indexed: 9)
  const [currentYear] = useState(2026);

  const filteredPosts = posts.filter((post) => {
    if (filterPlatform !== 'all' && !post.platforms.includes(filterPlatform as SocialPlatformId)) {
      return false;
    }
    if (filterStatus !== 'all' && post.status !== filterStatus) {
      return false;
    }
    return true;
  });

  // Calendar days generation for October 2026 (starts on Thursday = day index 4)
  const daysInMonth = 31;
  const startDayOffset = 4; // Oct 1, 2026 is Thursday
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Auto-Publish Calendar</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Cloud Queue Active
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Visual scheduler managing scheduled posts across YouTube, Instagram, X, LinkedIn, Facebook, and Pinterest.
          </p>
        </div>

        <button
          onClick={onNavigateToStudio}
          className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Scheduled Post</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 text-[11px] font-mono">Filter Platform:</span>
          {['all', 'instagram', 'youtube', 'linkedin', 'twitter'].map((plat) => (
            <button
              key={plat}
              onClick={() => setFilterPlatform(plat)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                filterPlatform === plat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {plat === 'all' ? 'All Platforms' : plat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 text-[11px] font-mono">Status:</span>
          {['all', 'scheduled', 'published'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                filterStatus === st
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid View */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        {/* Calendar Nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white">October {currentYear}</span>
            <span className="text-xs text-neutral-400 font-mono">· {filteredPosts.length} posts scheduled</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonthIndex((prev) => Math.min(11, prev + 1))}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Table */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-[11px] font-mono uppercase text-neutral-500 py-1 font-semibold">
              {day}
            </div>
          ))}

          {/* Empty offset days */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-lg bg-neutral-950/20 border border-neutral-900/40 opacity-30" />
          ))}

          {/* Actual days */}
          {daysArray.map((day) => {
            const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
            const postsForDay = filteredPosts.filter((p) => p.scheduledDate === dateStr);
            const isToday = day === 1;

            return (
              <div
                key={day}
                className={`h-20 sm:h-24 p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-indigo-950/30 border-indigo-500/50'
                    : postsForDay.length > 0
                    ? 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    : 'bg-neutral-950/30 border-neutral-900/60 hover:bg-neutral-900/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono ${isToday ? 'font-bold text-indigo-400' : 'text-neutral-400'}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      Today
                    </span>
                  )}
                </div>

                {/* Post Chips for day */}
                <div className="space-y-1 overflow-y-auto max-h-12 scrollbar-none">
                  {postsForDay.map((p) => (
                    <div
                      key={p.id}
                      className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium flex items-center gap-1 ${
                        p.status === 'published'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/40'
                      }`}
                      title={p.title}
                    >
                      <Clock className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{p.scheduledTime} · {p.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Queue List / Feed Timeline */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white">Post Queue & Timeline</h3>

        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Media preview icon */}
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-700 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500 shrink-0">
                    {post.mediaType === 'video' ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono font-semibold ${
                      post.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Scheduled: {post.scheduledDate} at {post.scheduledTime}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white truncate">
                    {post.title}
                  </h4>

                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-0.5">
                    <span>Target Channels:</span>
                    <div className="flex items-center gap-1">
                      {post.platforms.map((plat) => (
                        <span key={plat} className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 uppercase font-mono">
                          {plat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {post.status === 'scheduled' && (
                  <button
                    onClick={() => onPublishNow(post)}
                    className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publish Now</span>
                  </button>
                )}
                {post.status === 'published' && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Live on Social Feed</span>
                  </span>
                )}
                <button
                  onClick={() => onDeletePost(post.id)}
                  aria-label="Delete post from queue"
                  className="p-2 rounded-lg bg-neutral-800/80 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove from queue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-neutral-900/30 border border-neutral-800">
              <CalendarIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm text-neutral-300 font-medium">No posts match the current filter.</p>
              <button
                onClick={onNavigateToStudio}
                className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
              >
                Create a new post in Studio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
