import { useState } from 'react';
import { 
  Play, Save, Check, User, Globe, Shield, RefreshCw 
} from 'lucide-react';
import { PlanTier } from '../types';

interface SettingsViewProps {
  currentPlanTier: PlanTier;
  onReplayIntro: () => void;
  showToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
}

export default function SettingsView({
  currentPlanTier,
  onReplayIntro,
  showToast,
}: SettingsViewProps) {
  const [creatorName, setCreatorName] = useState('Sanjib Konwar');
  const [handle, setHandle] = useState('@sanjib_creator');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [autoHashtags, setAutoHashtags] = useState(true);
  const [crossPostShorts, setCrossPostShorts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    showToast('Preferences Saved', 'Your publishing pipeline settings have been updated.', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-bold text-white">App Settings & Workspace</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure default publishing timezones, creator identity, and automated distribution rules.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Creator Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-neutral-300 mb-1">Display Name</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-300 mb-1">Primary Social Handle</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs text-neutral-300 mb-1">Publishing Timezone</label>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-500" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
              <option value="America/New_York (EST)">America/New_York (EST)</option>
              <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT)</option>
              <option value="Asia/Dubai (GST +4:00)">Asia/Dubai (GST +4:00)</option>
              <option value="Asia/Singapore (SGT +8:00)">Asia/Singapore (SGT +8:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Distribution Automations */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Automation Rules</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Auto-Append Relevant Hashtags</span>
              <span className="text-neutral-400 text-[11px]">Injects 5 high-converting hashtags optimized for each platform algorithm</span>
            </div>
            <input
              type="checkbox"
              checked={autoHashtags}
              onChange={(e) => setAutoHashtags(e.target.checked)}
              className="accent-indigo-600 w-4 h-4 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Cross-Post 9:16 Media to Shorts & Reels</span>
              <span className="text-neutral-400 text-[11px]">Automatically synchronizes vertical reels across YouTube and Instagram</span>
            </div>
            <input
              type="checkbox"
              checked={crossPostShorts}
              onChange={(e) => setCrossPostShorts(e.target.checked)}
              className="accent-indigo-600 w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Intro Video Re-play button */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Replay Intro Video Animation</h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Experience the 1.5-second high-speed kinetic branding launch animation again.
          </p>
        </div>
        <button
          onClick={onReplayIntro}
          className="py-2 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-indigo-300 border border-neutral-700 font-medium flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          <span>Play Intro</span>
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}
