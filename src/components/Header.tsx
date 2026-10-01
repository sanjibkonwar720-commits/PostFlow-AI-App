import { 
  ArrowLeft, Smartphone, Monitor, Bell, LogOut, 
  Crown, RefreshCw 
} from 'lucide-react';
import { PlanTier } from '../types';

interface HeaderProps {
  currentPage: string;
  onNavigateBack: () => void;
  onNavigate: (page: string) => void;
  currentPlanTier: PlanTier;
  onOpenPricing: () => void;
  onTriggerExit: () => void;
  isMobileDeviceView: boolean;
  onToggleMobileView: () => void;
  connectedCount: number;
}

export default function Header({
  currentPage,
  onNavigateBack,
  onNavigate,
  currentPlanTier,
  onOpenPricing,
  onTriggerExit,
  isMobileDeviceView,
  onToggleMobileView,
  connectedCount,
}: HeaderProps) {
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'studio': return 'Content Studio';
      case 'schedule': return 'Auto-Publish Calendar';
      case 'accounts': return 'Social Accounts';
      case 'analytics': return 'Analytics & Insights';
      case 'pricing': return 'Subscription & Upgrades';
      case 'settings': return 'App Settings';
      default: return 'Overview';
    }
  };

  const isSubPage = currentPage !== 'dashboard';

  return (
    <header className="sticky top-0 z-30 w-full h-14 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 px-3 sm:px-6 flex items-center justify-between">
      {/* Left: In-App Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {isSubPage ? (
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors text-xs font-medium cursor-pointer"
            title="Go back to Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Back</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
            title="PostFlow AI Dashboard"
          >
            <img
              src="/logo.png"
              alt="PostFlow AI Logo"
              className="h-8 w-8 rounded-xl object-contain shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              PostFlow AI
            </span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500">
          <span>/</span>
          <span className="text-neutral-300 font-medium">{getPageTitle(currentPage)}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {connectedCount} channels live
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Device Viewport Toggle (Full responsive vs Mobile App Frame) */}
        <button
          onClick={onToggleMobileView}
          className="hidden lg:flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80 text-xs transition-colors cursor-pointer"
          title={isMobileDeviceView ? "Switch to Full Desktop View" : "Simulate Mobile Device App"}
        >
          {isMobileDeviceView ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
              <span>Desktop View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mobile View</span>
            </>
          )}
        </button>

        {/* Current Plan Badge & Upgrade Action */}
        <button
          onClick={onOpenPricing}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors cursor-pointer"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="capitalize">{currentPlanTier}</span>
          <span className="text-[10px] text-indigo-400/80 underline font-sans ml-0.5">Upgrade</span>
        </button>

        {/* Refresh Sync button */}
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('postflow-refresh'));
          }}
          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80 transition-colors cursor-pointer"
          title="Sync Social Feeds"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => onNavigate('schedule')}
          className="relative p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80 transition-colors cursor-pointer"
          title="Scheduled posts queue"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* Exit App Trigger Button */}
        <button
          onClick={onTriggerExit}
          className="flex items-center gap-1 py-1 px-2 rounded-lg bg-neutral-900 hover:bg-rose-950/30 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-900/40 transition-colors text-xs cursor-pointer"
          title="Exit PostFlow AI"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </header>
  );
}
