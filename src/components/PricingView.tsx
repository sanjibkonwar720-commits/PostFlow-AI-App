import { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { PlanConfig, PlanTier } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

interface PricingViewProps {
  currentPlanTier: PlanTier;
  onSelectPlanToUpgrade: (plan: PlanConfig) => void;
}

export default function PricingView({
  currentPlanTier,
  onSelectPlanToUpgrade,
}: PricingViewProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const featureMatrix = [
    {
      label: 'Social Platforms Connected',
      starter: 'Max 2 Platforms',
      pro: 'Max 4 Platforms',
      premium: 'Max 7 Platforms',
      ultimate: 'All Platforms Unlimited',
    },
    {
      label: 'Monthly Auto-Posts',
      starter: 'Up to 30 Posts',
      pro: 'Up to 100 Posts',
      premium: 'Up to 300 Posts',
      ultimate: 'Unlimited Auto-Publishing',
    },
    {
      label: 'AI Content Generator',
      starter: 'Basic Text Prompts',
      pro: 'Text + Image Prompts',
      premium: 'Advanced AI + Video Script',
      ultimate: 'Full AI Suite (Text, Image, Video, Voice)',
    },
    {
      label: 'Analytics Dashboard',
      starter: 'Basic Reach Stats',
      pro: 'Detailed Engagement',
      premium: 'Advanced Performance',
      ultimate: 'Full Analytics + PDF Export',
    },
    {
      label: 'Multi-Account Manager',
      starter: '1 Profile',
      pro: '2 Profiles',
      premium: '5 Profiles',
      ultimate: 'Unlimited Profiles',
    },
    {
      label: 'Customer Support',
      starter: 'Email Support',
      pro: 'Priority Email',
      premium: 'Chat Support',
      ultimate: '24/7 VIP Priority Support',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Flexible Creator & Agency Pricing</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Supercharge Your Social Publishing
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          Scale your audience without scaling manual effort. Seamlessly upgrade or downgrade anytime.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs mt-3">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`py-1.5 px-4 rounded-lg font-medium transition-all cursor-pointer ${
              billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`py-1.5 px-4 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Annual (Save 20%)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
              2 mo free
            </span>
          </button>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentPlanTier === plan.id;
          const displayPrice = billingCycle === 'monthly' 
            ? plan.priceMonthly 
            : Math.round(plan.priceAnnual / 12);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-indigo-950/40 via-neutral-900 to-neutral-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-white font-mono">₹{displayPrice}</span>
                  <span className="text-xs text-neutral-400">/month</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-neutral-500 font-mono mb-3">
                    Billed ₹{plan.priceAnnual}/year
                  </p>
                )}

                {/* Key Bullet Points */}
                <div className="space-y-2.5 pt-3 border-t border-neutral-800 text-xs text-neutral-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>{plan.platformsLimit === 999 ? 'Unlimited' : plan.platformsLimit}</strong> Social Platforms</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>{plan.postsLimit === 999999 ? 'Unlimited' : plan.postsLimit}</strong> Auto-Posts/mo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{plan.aiModelTier}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{plan.analyticsLevel}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{plan.profilesLimit === 999 ? 'Unlimited' : plan.profilesLimit} Profile(s)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{plan.supportLevel}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button
                  onClick={() => onSelectPlanToUpgrade(plan)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-neutral-800 text-neutral-400 cursor-default'
                      : plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                  }`}
                >
                  {isCurrent ? 'Current Active Tier' : `Select ${plan.name} Tier`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>Full Specification Comparison Table</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase">
                <th className="py-3 px-3">Feature</th>
                <th className="py-3 px-3">Starter (₹199)</th>
                <th className="py-3 px-3 text-indigo-400 font-bold">Pro (₹299)</th>
                <th className="py-3 px-3">Premium (₹399)</th>
                <th className="py-3 px-3 text-cyan-400 font-bold">Ultimate (₹499)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
              {featureMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-neutral-950/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{row.label}</td>
                  <td className="py-3 px-3 text-neutral-400">{row.starter}</td>
                  <td className="py-3 px-3 text-indigo-300 font-medium">{row.pro}</td>
                  <td className="py-3 px-3 text-neutral-200">{row.premium}</td>
                  <td className="py-3 px-3 text-cyan-300 font-semibold">{row.ultimate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center py-4 text-xs text-neutral-400">
        <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>All Indian UPI & Global Cards Supported</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Instant Auto-Activation upon Payment</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Cancel or Change Plan Anytime</span>
        </div>
      </div>
    </div>
  );
}
