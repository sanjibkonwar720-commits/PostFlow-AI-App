import { useState } from 'react';
import { 
  CheckCircle2, RefreshCw, Unlink, Lock, 
  Sparkles, ExternalLink, Shield
} from 'lucide-react';
import { SocialAccount, PlanConfig } from '../types';

interface AccountsViewProps {
  accounts: SocialAccount[];
  currentPlan: PlanConfig;
  onToggleConnect: (accountId: string) => void;
  onOpenPricing: () => void;
  showToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
}

export default function AccountsView({
  accounts,
  currentPlan,
  onToggleConnect,
  onOpenPricing,
  showToast,
}: AccountsViewProps) {
  const [selectedOAuthAccount, setSelectedOAuthAccount] = useState<SocialAccount | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);

  const connectedCount = accounts.filter((a) => a.connected).length;
  const isLimitReached = connectedCount >= currentPlan.platformsLimit;

  const handleInitiateConnect = (acc: SocialAccount) => {
    if (acc.connected) {
      // Disconnect
      onToggleConnect(acc.id);
      showToast('Account Disconnected', `${acc.name} has been disconnected.`, 'info');
      return;
    }

    if (isLimitReached) {
      showToast(
        'Platform Limit Reached',
        `The ${currentPlan.name} plan allows up to ${currentPlan.platformsLimit} connected channels. Upgrade to connect more.`,
        'error'
      );
      onOpenPricing();
      return;
    }

    // Open OAuth simulation dialog
    setSelectedOAuthAccount(acc);
  };

  const handleConfirmOAuth = () => {
    if (!selectedOAuthAccount) return;
    setIsAuthenticating(true);

    setTimeout(() => {
      onToggleConnect(selectedOAuthAccount.id);
      setIsAuthenticating(false);
      showToast(
        'OAuth Connected Successfully',
        `${selectedOAuthAccount.name} (${selectedOAuthAccount.handle}) is now linked for auto-publishing.`,
        'success'
      );
      setSelectedOAuthAccount(null);
    }, 1200);
  };

  const handleRefreshToken = (accId: string, accName: string) => {
    setIsRefreshing(accId);
    setTimeout(() => {
      setIsRefreshing(null);
      showToast('OAuth Token Refreshed', `${accName} publishing token renewed for 60 days.`, 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Social Media Channels</span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              OAuth 2.0 Management
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Connect your official creator accounts to enable automated scheduling and real-time feed synchronization.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-neutral-300 font-mono p-2 rounded-xl bg-neutral-900 border border-neutral-800">
            <span>Connected: </span>
            <span className="font-bold text-emerald-400">{connectedCount}</span>
            <span className="text-neutral-500"> / {currentPlan.platformsLimit === 999 ? 'Unlimited' : currentPlan.platformsLimit}</span>
          </div>
          {isLimitReached && (
            <button
              onClick={onOpenPricing}
              className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock More</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isConnected = acc.connected;

          return (
            <div
              key={acc.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isConnected
                  ? 'bg-neutral-900/80 border-neutral-700/80 shadow-lg'
                  : 'bg-neutral-950/50 border-neutral-800/80 opacity-90'
              }`}
            >
              <div>
                {/* Top Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shadow-md"
                      />
                      {isConnected && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{acc.name}</h4>
                      <p className="text-xs text-neutral-400 font-mono">{acc.handle}</p>
                      <span className="text-[10px] text-neutral-500">{acc.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {isConnected ? 'Active' : 'Unlinked'}
                  </span>
                </div>

                {/* Details box */}
                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/60 mb-4 space-y-1.5 text-xs text-neutral-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Audience:</span>
                    <span className="text-neutral-200 font-semibold">{acc.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Sync Status:</span>
                    <span className={isConnected ? 'text-emerald-400' : 'text-neutral-500'}>
                      {acc.lastSync}
                    </span>
                  </div>
                </div>

                {/* Scope chips */}
                <div className="mb-4">
                  <span className="text-[10px] text-neutral-500 font-mono block mb-1">API Permissions:</span>
                  <div className="flex flex-wrap gap-1">
                    {acc.scopes.map((s) => (
                      <span key={s} className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800/80 text-neutral-400 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleRefreshToken(acc.id, acc.name)}
                      disabled={isRefreshing === acc.id}
                      className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Renew OAuth token"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing === acc.id ? 'animate-spin text-indigo-400' : ''}`} />
                      <span>{isRefreshing === acc.id ? 'Syncing...' : 'Sync'}</span>
                    </button>

                    <button
                      onClick={() => handleInitiateConnect(acc)}
                      className="py-1.5 px-3 rounded-lg bg-neutral-800/70 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleInitiateConnect(acc)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <span>Connect {acc.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* OAuth Authorization Modal */}
      {selectedOAuthAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Connect {selectedOAuthAccount.name}</h3>
                <p className="text-xs text-neutral-400 font-mono">OAuth 2.0 Authorization Flow</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              PostFlow AI requires official publisher permissions to schedule, publish, and fetch engagement analytics on your behalf.
            </p>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs text-neutral-300">
              <div className="font-semibold text-neutral-200">Permissions Requested:</div>
              <ul className="space-y-1 text-neutral-400 font-mono text-[11px]">
                {selectedOAuthAccount.scopes.map((scope) => (
                  <li key={scope} className="flex items-center gap-1.5 text-indigo-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{scope}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setSelectedOAuthAccount(null)}
                disabled={isAuthenticating}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-medium cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOAuth}
                disabled={isAuthenticating}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <span>Authorize Access</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
