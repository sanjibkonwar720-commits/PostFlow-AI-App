import { 
  LayoutDashboard, Wand2, Calendar, Share2, 
  BarChart3, CreditCard, Settings, Sparkles 
} from 'lucide-react';
import { PlanTier } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentPlanTier: PlanTier;
  onOpenPricing: () => void;
}

export default function Sidebar({
  currentPage,
  onNavigate,
  currentPlanTier,
  onOpenPricing,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'studio', label: 'Content Studio', icon: Wand2, highlight: true },
    { id: 'schedule', label: 'Schedule & Calendar', icon: Calendar },
    { id: 'accounts', label: 'Social Accounts', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing Plans', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left side) */}
      <aside className="hidden md:flex flex-col justify-between w-60 h-[calc(100vh-3.5rem)] bg-neutral-950/70 border-r border-neutral-900/80 p-3 shrink-0">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            Platform Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white border border-neutral-800 shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Subscription Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800/80 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-white capitalize">{currentPlanTier} Tier</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-[11px] text-neutral-400 leading-snug mb-3">
            {currentPlanTier === 'starter' && 'Connect 2 platforms. Upgrade for 4K video scripts & unmetered posts.'}
            {currentPlanTier === 'pro' && '4 channels active. Upgrade to Premium for 7 platforms & video scripts.'}
            {currentPlanTier === 'premium' && '7 channels active. Full auto-posting suite unlocked.'}
            {currentPlanTier === 'ultimate' && 'VIP Access. Unlimited platforms & full AI multimedia suite.'}
          </p>
          <button
            onClick={onOpenPricing}
            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors text-center cursor-pointer shadow-sm"
          >
            {currentPlanTier === 'ultimate' ? 'Manage Plan' : 'Upgrade Plan'}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900 py-1.5 px-2 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors cursor-pointer ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[56px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
