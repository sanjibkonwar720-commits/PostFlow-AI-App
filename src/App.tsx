import { useState, useEffect, useCallback } from 'react';
import { PlanTier, PlanConfig, PostItem, SocialAccount } from './types';
import { SUBSCRIPTION_PLANS, INITIAL_SOCIAL_ACCOUNTS, INITIAL_POSTS } from './data/mockData';
import IntroVideo from './components/IntroVideo';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import StudioView from './components/StudioView';
import ScheduleView from './components/ScheduleView';
import AccountsView from './components/AccountsView';
import AnalyticsView from './components/AnalyticsView';
import PricingView from './components/PricingView';
import SettingsView from './components/SettingsView';
import ExitModal from './components/ExitModal';
import PaymentModal from './components/PaymentModal';
import Footer from './components/Footer';
import ToastContainer, { ToastMessage } from './components/Toast';

export default function App() {
  // 1. App Launch Intro Animation State
  const [showIntro, setShowIntro] = useState(true);

  // 2. Navigation Stack State
  const [navHistory, setNavHistory] = useState<string[]>(['dashboard']);
  const currentPage = navHistory[navHistory.length - 1] || 'dashboard';

  // 3. User Subscription & Plans State
  const [currentPlanTier, setCurrentPlanTier] = useState<PlanTier>('pro');
  const [paymentModalPlan, setPaymentModalPlan] = useState<PlanConfig | null>(null);

  // 4. Social Accounts & Posts State
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);

  // 5. Exit Modal State
  const [showExitModal, setShowExitModal] = useState(false);

  // 6. Mobile Device Viewport Toggle (Simulates stand-alone native mobile app)
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);

  // 7. Toast Notifications System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === currentPlanTier) || SUBSCRIPTION_PLANS[1];

  // Navigation handlers
  const navigateTo = (page: string) => {
    if (page === currentPage) return;
    setNavHistory((prev) => [...prev, page]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    if (navHistory.length > 1) {
      setNavHistory((prev) => prev.slice(0, prev.length - 1));
    } else {
      setNavHistory(['dashboard']);
    }
  };

  // Browser back-button handling & Exit Modal interception
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (navHistory.length > 1) {
        navigateBack();
      } else {
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navHistory]);

  // Social account connection toggle
  const handleToggleConnect = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          return {
            ...acc,
            connected: !acc.connected,
            lastSync: !acc.connected ? 'Just now' : 'Disconnected',
          };
        }
        return acc;
      })
    );
  };

  // Schedule Post handler
  const handleSchedulePost = (postData: Omit<PostItem, 'id' | 'status'>) => {
    const newPost: PostItem = {
      ...postData,
      id: 'post-' + (posts.length + 1) + '-' + Date.now().toString(36),
      status: 'scheduled',
    };
    setPosts([newPost, ...posts]);
    addToast('Post Successfully Scheduled!', `Scheduled for ${newPost.scheduledDate} at ${newPost.scheduledTime}.`, 'success');
  };

  // Publish Now handler
  const handlePublishNow = (post: PostItem | Omit<PostItem, 'id' | 'status'>) => {
    addToast('Pushing to Social Feeds...', `Broadcasting to ${post.platforms.join(', ').toUpperCase()}...`, 'info');

    // Simulate multi-channel API delivery
    setTimeout(() => {
      const publishedPost: PostItem = {
        ...post,
        id: 'id' in post ? post.id : 'post-' + Date.now().toString(36),
        status: 'published',
        publishedAt: new Date().toISOString(),
        impressions: Math.floor(Math.random() * 2500) + 500,
        engagement: Math.floor(Math.random() * 180) + 40,
      };

      setPosts((prev) => {
        const exists = prev.some((p) => p.id === publishedPost.id);
        if (exists) {
          return prev.map((p) => (p.id === publishedPost.id ? publishedPost : p));
        }
        return [publishedPost, ...prev];
      });

      addToast(
        'Auto-Published Successfully! 🚀',
        `Live on ${post.platforms.length} connected platforms with active analytics tracking.`,
        'success'
      );
    }, 1200);
  };

  // Delete Post handler
  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    addToast('Post Removed', 'Removed from publishing queue.', 'info');
  };

  // Payment Success handler
  const handlePaymentSuccess = (newPlanTier: PlanTier) => {
    setCurrentPlanTier(newPlanTier);
    setPaymentModalPlan(null);
    const planObj = SUBSCRIPTION_PLANS.find((p) => p.id === newPlanTier);
    addToast(
      'Plan Upgraded Successfully! 🎉',
      `You now have access to the ${planObj?.name} tier with ${planObj?.platformsLimit === 999 ? 'unlimited' : planObj?.platformsLimit} platforms and ${planObj?.aiModelTier}.`,
      'success'
    );
  };

  // Exit App confirmation handler
  const handleConfirmExit = () => {
    setShowExitModal(false);
    addToast('Session Ended', 'You have exited PostFlow AI. Have a productive day!', 'info');
    // Soft reset navigation
    setNavHistory(['dashboard']);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* 1. Launch Intro Video Animation (1.5 seconds) */}
      {showIntro && (
        <IntroVideo onComplete={() => setShowIntro(false)} />
      )}

      {/* Main App Container (Supports Full Responsive or Mobile Frame Preview) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobileDeviceView
            ? 'max-w-[420px] mx-auto my-6 rounded-[40px] border-[8px] border-neutral-800 shadow-2xl overflow-hidden min-h-[840px] bg-[#090a0f] ring-1 ring-neutral-700'
            : 'w-full'
        }`}
      >
        {/* Mobile View Island Indicator */}
        {isMobileDeviceView && (
          <div className="w-full bg-neutral-950 pt-2 pb-1 flex justify-center items-center">
            <div className="w-24 h-4 bg-neutral-900 rounded-full flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            </div>
          </div>
        )}

        {/* Global Navigation Header with Back Button */}
        <Header
          currentPage={currentPage}
          onNavigateBack={navigateBack}
          onNavigate={navigateTo}
          currentPlanTier={currentPlanTier}
          onOpenPricing={() => navigateTo('pricing')}
          onTriggerExit={() => setShowExitModal(true)}
          isMobileDeviceView={isMobileDeviceView}
          onToggleMobileView={() => setIsMobileDeviceView(!isMobileDeviceView)}
          connectedCount={accounts.filter((a) => a.connected).length}
        />

        {/* Content Body with Sidebar Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar
            currentPage={currentPage}
            onNavigate={navigateTo}
            currentPlanTier={currentPlanTier}
            onOpenPricing={() => navigateTo('pricing')}
          />

          {/* Active View Container */}
          <main className="flex-1 p-3 sm:p-6 overflow-y-auto max-w-7xl mx-auto w-full pb-20 md:pb-8">
            {currentPage === 'dashboard' && (
              <DashboardView
                currentPlan={currentPlan}
                accounts={accounts}
                posts={posts}
                onNavigate={navigateTo}
                onPublishNow={handlePublishNow}
                onOpenPricing={() => navigateTo('pricing')}
              />
            )}

            {currentPage === 'studio' && (
              <StudioView
                currentPlan={currentPlan}
                onSchedulePost={handleSchedulePost}
                onPublishImmediately={handlePublishNow}
                onOpenPricing={() => navigateTo('pricing')}
                showToast={addToast}
              />
            )}

            {currentPage === 'schedule' && (
              <ScheduleView
                posts={posts}
                onPublishNow={handlePublishNow}
                onDeletePost={handleDeletePost}
                onNavigateToStudio={() => navigateTo('studio')}
              />
            )}

            {currentPage === 'accounts' && (
              <AccountsView
                accounts={accounts}
                currentPlan={currentPlan}
                onToggleConnect={handleToggleConnect}
                onOpenPricing={() => navigateTo('pricing')}
                showToast={addToast}
              />
            )}

            {currentPage === 'analytics' && (
              <AnalyticsView
                currentPlan={currentPlan}
                onOpenPricing={() => navigateTo('pricing')}
                showToast={addToast}
              />
            )}

            {currentPage === 'pricing' && (
              <PricingView
                currentPlanTier={currentPlanTier}
                onSelectPlanToUpgrade={(plan) => setPaymentModalPlan(plan)}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsView
                currentPlanTier={currentPlanTier}
                onReplayIntro={() => setShowIntro(true)}
                showToast={addToast}
              />
            )}
          </main>
        </div>

        {/* Global Footer with explicit App Owner Credit */}
        <Footer />
      </div>

      {/* Exit Confirmation Modal */}
      <ExitModal
        isOpen={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
      />

      {/* Payment Gateway Modal (Global & Indian Payment Integration) */}
      {paymentModalPlan && (
        <PaymentModal
          isOpen={!!paymentModalPlan}
          onClose={() => setPaymentModalPlan(null)}
          selectedPlan={paymentModalPlan}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
