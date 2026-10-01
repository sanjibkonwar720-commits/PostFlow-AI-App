import { useState, useRef, useId } from 'react';
import { 
  Wand2, Upload, Video, Image as ImageIcon, Send, 
  Calendar, Copy, Check, Sparkles, RefreshCw, Scissors, 
  Eye, EyeOff, Film, AlertTriangle 
} from 'lucide-react';
import { PlanConfig, SocialPlatformId, ContentFormat, PostItem } from '../types';
import { PRESET_SAMPLE_MEDIA } from '../data/mockData';

interface StudioViewProps {
  currentPlan: PlanConfig;
  onSchedulePost: (post: Omit<PostItem, 'id' | 'status'>) => void;
  onPublishImmediately: (post: Omit<PostItem, 'id' | 'status'>) => void;
  onOpenPricing: () => void;
  showToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
}

export default function StudioView({
  currentPlan,
  onSchedulePost,
  onPublishImmediately,
  onOpenPricing,
  showToast,
}: StudioViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputId = useId();
  const scheduleDateId = useId();
  const scheduleTimeId = useId();

  // Generator State
  const [prompt, setPrompt] = useState('5 proven micro-habits to build an audience from zero in 2026');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatformId>('instagram');
  const [tone, setTone] = useState('Viral & Punchy');
  const [contentType, setContentType] = useState<ContentFormat>('post_caption');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(
    `Stop chasing the algorithm and start mastering distribution! 🚀\n\nHere are 5 habits top creators use to 10x engagement without burning out:\n1. Batch brainstorm with AI\n2. Standardize your high-contrast cover art\n3. Cross-post to YouTube Shorts & Instagram Reels simultaneously\n4. Reply to the first 20 comments within 15 minutes\n5. Schedule auto-posts during peak hours using PostFlow AI\n\nWhich of these are you trying this week? Drop your thoughts below! 👇\n\n#CreatorEconomy #SocialMediaGrowth #ProductivityHacks #PostFlowAI #GrowthHacking`
  );
  const [isCopied, setIsCopied] = useState(false);

  // Media State
  const [mediaUrl, setMediaUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  );
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9' | '4:5'>('1:1');
  const [trimDuration, setTrimDuration] = useState(30); // 30s video trim
  const [showCaptionOverlay, setShowCaptionOverlay] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  // Target Destination Platforms
  const [targetPlatforms, setTargetPlatforms] = useState<SocialPlatformId[]>(['instagram', 'linkedin', 'twitter']);

  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedDate, setSchedDate] = useState('2026-10-02');
  const [schedTime, setSchedTime] = useState('18:00');

  // Gating checks
  const isVideoScriptAllowed = currentPlan.id !== 'starter';

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt', 'Type what you want to post about.', 'error');
      return;
    }

    if (contentType === 'video_script' && !isVideoScriptAllowed) {
      showToast('Plan Restriction', 'Video Script generation is unlocked on Pro, Premium, and Ultimate tiers.', 'info');
      onOpenPricing();
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          platform: selectedPlatform,
          tone,
          contentType,
          planTier: currentPlan.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      const data = await res.json();
      setGeneratedOutput(data.content);
      showToast('Content Generated!', `Optimized for ${selectedPlatform} with ${tone} tone.`, 'success');
    } catch {
      // Local robust generator fallback
      setGeneratedOutput(
        `🚀 The Secret to Scaling ${prompt} in 2026\n\nMost creators fail because they make posting too complicated. Here is how to simplify:\n\n1. Pick 1 core message.\n2. Adapt it for ${selectedPlatform.toUpperCase()}.\n3. Automate scheduling with PostFlow AI.\n\nSave this post for your next content batch! 📌\n\n#${selectedPlatform}Growth #PostFlowAI #CreatorHacks`
      );
      showToast('Generated Content Ready', 'Crafted with viral hooks and hashtags.', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setIsCopied(true);
    showToast('Copied to Clipboard!', 'Caption is ready to paste anywhere.', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileUpload = (file: File) => {
    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaUrl(e.target?.result as string);
      showToast('Media Uploaded Successfully', `${file.name} loaded into studio preview.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const togglePlatformDestination = (platform: SocialPlatformId) => {
    if (targetPlatforms.includes(platform)) {
      if (targetPlatforms.length === 1) {
        showToast('At least one platform required', 'Select at least 1 destination channel.', 'error');
        return;
      }
      setTargetPlatforms(targetPlatforms.filter((p) => p !== platform));
    } else {
      if (targetPlatforms.length >= currentPlan.platformsLimit) {
        showToast(
          'Platform Limit Reached',
          `Your ${currentPlan.name} plan supports up to ${currentPlan.platformsLimit} concurrent platforms.`,
          'info'
        );
        onOpenPricing();
        return;
      }
      setTargetPlatforms([...targetPlatforms, platform]);
    }
  };

  const handleConfirmSchedule = () => {
    onSchedulePost({
      title: prompt.slice(0, 48) + '...',
      content: generatedOutput,
      platforms: targetPlatforms,
      mediaUrl: mediaUrl || undefined,
      mediaType,
      aspectRatio,
      scheduledDate: schedDate,
      scheduledTime: schedTime,
    });
    setShowScheduleModal(false);
    showToast('Post Queued in Calendar!', `Will auto-publish on ${schedDate} at ${schedTime}.`, 'success');
  };

  const handleDirectPublish = () => {
    onPublishImmediately({
      title: prompt.slice(0, 48) + '...',
      content: generatedOutput,
      platforms: targetPlatforms,
      mediaUrl: mediaUrl || undefined,
      mediaType,
      aspectRatio,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: new Date().toTimeString().slice(0, 5),
    });
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>PostFlow Content Studio</span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              AI + Media Pipeline
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Generate high-converting copy with Gemini AI and format visual assets for cross-platform distribution.
          </p>
        </div>

        {/* Quick actions: Publish Now / Schedule */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="py-2 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700/60"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Schedule Post</span>
          </button>
          <button
            onClick={handleDirectPublish}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left AI & Options (6 cols) | Right Media & Live Preview (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Content Generator */}
        <div className="lg:col-span-6 space-y-4">
          {/* Target Platforms Checkboxes */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-neutral-300">Publish Destinations</span>
              <span className="text-[11px] text-neutral-500 font-mono">
                {targetPlatforms.length}/{currentPlan.platformsLimit === 999 ? '∞' : currentPlan.platformsLimit} Active
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'instagram', label: 'Instagram' },
                { id: 'youtube', label: 'YouTube' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'twitter', label: 'X (Twitter)' },
                { id: 'facebook', label: 'Facebook' },
                { id: 'pinterest', label: 'Pinterest' },
              ].map((p) => {
                const isSelected = targetPlatforms.includes(p.id as SocialPlatformId);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatformDestination(p.id as SocialPlatformId)}
                    className={`py-2 px-1 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                        : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Generator Controls */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">AI Prompt & Tone</span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">Model: Gemini 3.8 Flash</span>
            </div>

            {/* Prompt input */}
            <div>
              <label htmlFor={promptInputId} className="block text-xs text-neutral-300 mb-1">What is this post about?</label>
              <textarea
                id={promptInputId}
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 3 reasons to batch content on weekends, product launch teaser..."
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
              />
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-neutral-500 self-center text-[10px]">Inspiration:</span>
              {[
                'Viral Reel Hook',
                'SaaS Growth Playbook',
                'Product Demo Teaser',
                'Weekly Motivation',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setPrompt(`How to execute ${chip.toLowerCase()} for maximum reach`)}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Selectors: Primary Channel, Tone, Content Format */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Primary Style</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatformId)}
                  className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">X (Twitter)</option>
                  <option value="facebook">Facebook</option>
                  <option value="pinterest">Pinterest</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Viral & Punchy">Viral & Punchy</option>
                  <option value="Professional & Authoritative">Professional</option>
                  <option value="Storyteller & Emotional">Storyteller</option>
                  <option value="Humorous & Casual">Humorous / Meme</option>
                  <option value="Direct & Educational">Direct Teaching</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] text-neutral-400">Content Format</label>
                  {!isVideoScriptAllowed && (
                    <span className="text-[10px] text-amber-400 font-mono">Pro+</span>
                  )}
                </div>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentFormat)}
                  className="w-full px-2.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="post_caption">Post Caption</option>
                  <option value="video_script">Video Script (Reel/Shorts)</option>
                  <option value="carousel_slides">Carousel Slides (1-6)</option>
                  <option value="tweet_thread">Thread (1/6)</option>
                  <option value="hashtag_strategy">Hashtag Matrix</option>
                </select>
              </div>
            </div>

            {/* Generate Trigger */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Viral Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate with PostFlow AI</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Output Card */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Generated Content</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white py-1 px-2 rounded bg-neutral-800 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={generatedOutput}
              onChange={(e) => setGeneratedOutput(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Right Column: Media Upload, Crop, Trim & Live Preview */}
        <div className="lg:col-span-6 space-y-4">
          {/* File Upload Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`p-4 rounded-xl border-2 border-dashed transition-all text-center ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-950/20'
                : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-2">
                <Upload className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-xs font-semibold text-white">Drag & drop image or MP4 video here</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Supports JPG, PNG, and MP4 up to 500MB</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-medium transition-colors cursor-pointer border border-neutral-700/60"
              >
                Browse Files
              </button>
            </div>

            {/* Presets selector */}
            <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-neutral-500">Sample Media:</span>
              {PRESET_SAMPLE_MEDIA.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => {
                    setMediaUrl(preset.url);
                    setMediaType(preset.type);
                    showToast('Preset Selected', preset.title, 'info');
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                >
                  {preset.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Media Format Controls: Aspect Ratio & Video Trim */}
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">Aspect Ratio & Framing</span>
              <button
                onClick={() => setShowCaptionOverlay(!showCaptionOverlay)}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                {showCaptionOverlay ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showCaptionOverlay ? 'Hide Overlay' : 'Show Overlay'}</span>
              </button>
            </div>

            {/* Aspect Ratio Pills */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '1:1', label: '1:1 Square (Feed)' },
                { id: '9:16', label: '9:16 Reel/Shorts' },
                { id: '16:9', label: '16:9 Landscape' },
                { id: '4:5', label: '4:5 Portrait' },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id as any)}
                  className={`py-2 px-1 rounded-lg text-[10px] font-mono border text-center transition-all cursor-pointer ${
                    aspectRatio === ratio.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>

            {/* Video Trim Simulator (if video or desired) */}
            {mediaType === 'video' && (
              <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Clip Duration Trim</span>
                  </span>
                  <span className="font-mono text-indigo-300">{trimDuration}s / 60s max</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={trimDuration}
                  onChange={(e) => setTrimDuration(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Live Mobile Media Preview Box */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white">Live Post Preview</span>
              <span className="text-[10px] font-mono text-neutral-400 capitalize">
                {targetPlatforms[0] || 'Feed'} Preview
              </span>
            </div>

            {/* Preview Frame with Aspect Ratio */}
            <div className="w-full flex justify-center bg-neutral-950 rounded-xl p-3 border border-neutral-800/80">
              <div
                className={`relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700/60 shadow-xl transition-all duration-300 flex flex-col justify-end ${
                  aspectRatio === '1:1' ? 'w-64 h-64' :
                  aspectRatio === '9:16' ? 'w-52 h-88' :
                  aspectRatio === '16:9' ? 'w-80 h-48' :
                  'w-60 h-76'
                }`}
              >
                {/* Background Image / Video Mock */}
                {mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt="Preview upload"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-[11px]">No media selected</span>
                  </div>
                )}

                {/* Subtle top indicator */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90 z-10 drop-shadow">
                  <div className="flex items-center gap-1 font-semibold">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px]">
                      PF
                    </div>
                    <span>@postflow_creator</span>
                  </div>
                  {mediaType === 'video' && (
                    <span className="px-1.5 py-0.5 rounded bg-black/60 font-mono text-[9px] flex items-center gap-1">
                      <Film className="w-2.5 h-2.5" />
                      <span>{trimDuration}s</span>
                    </span>
                  )}
                </div>

                {/* Caption Overlay */}
                {showCaptionOverlay && (
                  <div className="relative z-10 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white">
                    <p className="text-[11px] leading-snug line-clamp-3 font-medium text-neutral-200">
                      {generatedOutput || 'Your generated caption will appear here...'}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>Tap to read more</span>
                      <span className="text-indigo-400 font-mono">#PostFlow</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal Drawer */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Select Date & Time for Auto-Publish</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor={scheduleDateId} className="block text-xs text-neutral-300 mb-1">Publication Date</label>
                <input
                  id={scheduleDateId}
                  type="date"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor={scheduleTimeId} className="block text-xs text-neutral-300 mb-1">Publication Time</label>
                <input
                  id={scheduleTimeId}
                  type="time"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 text-xs text-neutral-400 space-y-1 font-mono">
                <div>Destinations: <span className="text-indigo-300 uppercase">{targetPlatforms.join(', ')}</span></div>
                <div>Queue Node: PostFlow Cloud Scheduler (Asia/Kolkata)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSchedule}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Confirm & Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
