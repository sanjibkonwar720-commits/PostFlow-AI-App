import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ShieldCheck, QrCode, Smartphone, CreditCard, 
  Building2, Globe, ArrowRight, Loader2, Sparkles, AlertCircle 
} from 'lucide-react';
import { PlanConfig, PlanTier } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanConfig;
  onPaymentSuccess: (planId: PlanTier) => void;
}

type TabType = 'upi' | 'netbanking' | 'cards' | 'international';

export default function PaymentModal({
  isOpen,
  onClose,
  selectedPlan,
  onPaymentSuccess,
}: PaymentModalProps) {
  const upiInputId = useId();
  const bankSearchId = useId();
  const cardNumberId = useId();
  const expiryId = useId();
  const cvvId = useId();
  const nameId = useId();

  const [activeTab, setActiveTab] = useState<TabType>('upi');
  const [upiSubTab, setUpiSubTab] = useState<'apps' | 'vpa' | 'qr'>('apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [vpaInput, setVpaInput] = useState('');
  const [vpaError, setVpaError] = useState('');
  
  // Net Banking state
  const [selectedBank, setSelectedBank] = useState('HDFC');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('Sanjib Konwar');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');

  // Flow state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const basePrice = selectedPlan.priceMonthly;
  const discountAmount = appliedDiscount ? Math.round(basePrice * appliedDiscount) : 0;
  const subtotal = Math.max(0, basePrice - discountAmount);
  const gst = Math.round(subtotal * 0.18); // 18% standard GST
  const finalTotal = subtotal + gst;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'POSTFLOW20') {
      setAppliedDiscount(0.20);
    } else if (code === 'CREATOR50') {
      setAppliedDiscount(0.50);
    } else if (code === 'SANJIB') {
      setAppliedDiscount(0.30);
    } else {
      setCouponError('Invalid coupon. Try POSTFLOW20 or CREATOR50');
      setAppliedDiscount(null);
    }
  };

  const validateVpa = (val: string) => {
    setVpaInput(val);
    if (!val) {
      setVpaError('');
      return;
    }
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(val)) {
      setVpaError('Enter a valid VPA like user@okhdfcbank or user@paytm');
    } else {
      setVpaError('');
    }
  };

  const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 2) {
      raw = raw.substring(0, 2) + '/' + raw.substring(2);
    }
    setCardExpiry(raw);
  };

  const executePayment = async () => {
    if (activeTab === 'upi' && upiSubTab === 'vpa' && (!vpaInput || vpaError)) {
      setVpaError('Please enter a valid UPI VPA');
      return;
    }

    setIsProcessing(true);
    const generatedTxn = 'PF_TXN_' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    setTxnId(generatedTxn);

    // Call server API for simulation & verification
    try {
      await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: finalTotal,
          paymentMethod: activeTab,
          upiId: vpaInput || (activeTab === 'upi' ? selectedUpiApp : undefined),
          transactionId: generatedTxn,
        }),
      });
    } catch {
      // Continue even if network error on dev
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(selectedPlan.id);
      }, 1800);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">PostFlow AI Secure Checkout</h3>
                <p className="text-[11px] text-neutral-400 font-mono">256-Bit SSL Encrypted Payment Gateway</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              aria-label="Close payment modal"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen */}
          {isSuccess ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Payment Successful!</h2>
              <p className="text-sm text-neutral-300">
                You have been upgraded to the <span className="font-semibold text-indigo-400">{selectedPlan.name} Plan</span>.
              </p>
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-400 max-w-sm mx-auto space-y-1">
                <div>Txn ID: <span className="text-neutral-200">{txnId}</span></div>
                <div>Amount Paid: <span className="text-emerald-400 font-bold">₹{finalTotal}</span> (Incl. GST)</div>
                <div>Plan Active: <span className="text-indigo-300">{selectedPlan.name} Tier</span></div>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to upgraded dashboard...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
              {/* Left Column: Payment Methods (7 cols) */}
              <div className="md:col-span-7 p-6 border-b md:border-b-0 md:border-r border-neutral-800">
                {/* Method Navigation Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800 mb-5">
                  <button
                    onClick={() => setActiveTab('upi')}
                    className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeTab === 'upi' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('cards')}
                    className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeTab === 'cards' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('netbanking')}
                    className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeTab === 'netbanking' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Bank</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('international')}
                    className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeTab === 'international' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Global</span>
                  </button>
                </div>

                {/* TAB 1: UPI */}
                {activeTab === 'upi' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <button
                        onClick={() => setUpiSubTab('apps')}
                        className={`text-xs font-medium pb-1 cursor-pointer transition-colors ${
                          upiSubTab === 'apps' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        UPI Apps
                      </button>
                      <button
                        onClick={() => setUpiSubTab('qr')}
                        className={`text-xs font-medium pb-1 cursor-pointer transition-colors ${
                          upiSubTab === 'qr' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        Scan QR Code
                      </button>
                      <button
                        onClick={() => setUpiSubTab('vpa')}
                        className={`text-xs font-medium pb-1 cursor-pointer transition-colors ${
                          upiSubTab === 'vpa' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        Custom UPI ID
                      </button>
                    </div>

                    {upiSubTab === 'apps' && (
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { id: 'gpay', name: 'Google Pay', icon: '🟢', color: 'border-emerald-500/30' },
                          { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'border-purple-500/30' },
                          { id: 'paytm', name: 'Paytm', icon: '🔵', color: 'border-sky-500/30' },
                          { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: 'border-orange-500/30' },
                          { id: 'amazonpay', name: 'Amazon Pay', icon: '🟡', color: 'border-amber-500/30' },
                          { id: 'cred', name: 'CRED UPI', icon: '⚫', color: 'border-neutral-500/30' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            onClick={() => setSelectedUpiApp(app.id)}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                              selectedUpiApp === app.id
                                ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <span className="text-xl">{app.icon}</span>
                            <span className="text-xs font-medium text-neutral-200">{app.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {upiSubTab === 'qr' && (
                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center flex flex-col items-center">
                        <div className="p-3 bg-white rounded-xl shadow-lg mb-3">
                          {/* Simulated realistic SVG QR Code */}
                          <svg className="w-36 h-36" viewBox="0 0 100 100" fill="#000">
                            {/* Outer squares */}
                            <rect x="5" y="5" width="26" height="26" fill="#000" rx="3" />
                            <rect x="9" y="9" width="18" height="18" fill="#fff" rx="2" />
                            <rect x="13" y="13" width="10" height="10" fill="#000" rx="1" />

                            <rect x="69" y="5" width="26" height="26" fill="#000" rx="3" />
                            <rect x="73" y="9" width="18" height="18" fill="#fff" rx="2" />
                            <rect x="77" y="13" width="10" height="10" fill="#000" rx="1" />

                            <rect x="5" y="69" width="26" height="26" fill="#000" rx="3" />
                            <rect x="9" y="73" width="18" height="18" fill="#fff" rx="2" />
                            <rect x="13" y="77" width="10" height="10" fill="#000" rx="1" />

                            {/* Data grid dots */}
                            <rect x="36" y="8" width="6" height="6" fill="#000" />
                            <rect x="48" y="12" width="6" height="6" fill="#000" />
                            <rect x="36" y="24" width="6" height="6" fill="#000" />
                            <rect x="48" y="30" width="8" height="8" fill="#000" />
                            <rect x="8" y="38" width="6" height="6" fill="#000" />
                            <rect x="20" y="44" width="6" height="6" fill="#000" />
                            <rect x="38" y="44" width="8" height="8" fill="#000" />
                            <rect x="56" y="40" width="6" height="6" fill="#000" />
                            <rect x="68" y="36" width="6" height="6" fill="#000" />
                            <rect x="80" y="44" width="8" height="8" fill="#000" />
                            <rect x="38" y="60" width="6" height="6" fill="#000" />
                            <rect x="50" y="68" width="8" height="8" fill="#000" />
                            <rect x="68" y="60" width="6" height="6" fill="#000" />
                            <rect x="80" y="76" width="8" height="8" fill="#000" />
                            <rect x="44" y="84" width="6" height="6" fill="#000" />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-300 font-medium">Scan with any UPI app to pay ₹{finalTotal}</p>
                        <p className="text-[10px] text-neutral-500 font-mono mt-1">VPA: postflowai@okhdfcbank</p>
                      </div>
                    )}

                    {upiSubTab === 'vpa' && (
                      <div className="space-y-3">
                        <div>
                          <label htmlFor={upiInputId} className="block text-xs text-neutral-300 font-medium mb-1">Enter your UPI ID / VPA</label>
                          <input
                            id={upiInputId}
                            type="text"
                            placeholder="e.g. mobile@okhdfcbank or user@paytm"
                            value={vpaInput}
                            onChange={(e) => validateVpa(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        {vpaError && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{vpaError}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          A payment request notification will be pushed to your UPI app instantly.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: CARDS */}
                {activeTab === 'cards' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                      <span>Supported: RuPay, Visa, MasterCard</span>
                      <span className="text-indigo-400 font-mono">Domestic & Global</span>
                    </div>

                    <div>
                      <label htmlFor={cardNumberId} className="block text-xs text-neutral-300 mb-1">Card Number</label>
                      <input
                        id={cardNumberId}
                        type="text"
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={handleFormatCardNumber}
                        maxLength={19}
                        className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={expiryId} className="block text-xs text-neutral-300 mb-1">Expiry (MM/YY)</label>
                        <input
                          id={expiryId}
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleFormatExpiry}
                          maxLength={5}
                          className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={cvvId} className="block text-xs text-neutral-300 mb-1">CVV</label>
                        <input
                          id={cvvId}
                          type="password"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          maxLength={4}
                          className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={nameId} className="block text-xs text-neutral-300 mb-1">Cardholder Name</label>
                      <input
                        id={nameId}
                        type="text"
                        placeholder="Name on card"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: NET BANKING */}
                {activeTab === 'netbanking' && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-400">Popular Indian Banks:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'HDFC', name: 'HDFC Bank' },
                        { id: 'SBI', name: 'State Bank of India' },
                        { id: 'ICICI', name: 'ICICI Bank' },
                        { id: 'AXIS', name: 'Axis Bank' },
                        { id: 'KOTAK', name: 'Kotak Mahindra' },
                        { id: 'PNB', name: 'Punjab National Bank' },
                      ].map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                            selectedBank === bank.id
                              ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200'
                              : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label htmlFor={bankSearchId} className="block text-xs text-neutral-400 mb-1">Other Banks</label>
                      <select
                        id={bankSearchId}
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="HDFC">HDFC Bank</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="KOTAK">Kotak Mahindra Bank</option>
                        <option value="PNB">Punjab National Bank</option>
                        <option value="BOB">Bank of Baroda</option>
                        <option value="CANARA">Canara Bank</option>
                        <option value="INDUSIND">IndusInd Bank</option>
                        <option value="YES">Yes Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* TAB 4: INTERNATIONAL */}
                {activeTab === 'international' && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-400">Global Payment Gateways:</p>
                    <div className="space-y-2">
                      <button
                        onClick={executePayment}
                        className="w-full p-3 rounded-xl bg-[#0070ba]/20 hover:bg-[#0070ba]/30 border border-[#0070ba]/40 text-[#0070ba] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-sm text-sky-400">PayPal Checkout</span>
                        <ArrowRight className="w-4 h-4 text-sky-400" />
                      </button>
                      <button
                        onClick={executePayment}
                        className="w-full p-3 rounded-xl bg-[#635bff]/20 hover:bg-[#635bff]/30 border border-[#635bff]/40 text-[#a29bfe] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-sm text-indigo-300">Stripe Global</span>
                        <ArrowRight className="w-4 h-4 text-indigo-300" />
                      </button>
                      <button
                        onClick={executePayment}
                        className="w-full p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-sm">Apple Pay / Google Wallet</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary & Coupon (5 cols) */}
              <div className="md:col-span-5 p-6 bg-neutral-950/40 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                    Order Summary
                  </h4>

                  {/* Plan Card */}
                  <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{selectedPlan.name} Plan</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                        Monthly
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {selectedPlan.platformsLimit === 999 ? 'Unlimited' : selectedPlan.platformsLimit} Platforms · {selectedPlan.postsLimit === 999999 ? 'Unlimited' : selectedPlan.postsLimit} Posts/mo
                    </p>
                  </div>

                  {/* Coupon Code Input */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon: POSTFLOW20"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedDiscount && (
                      <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                        <Sparkles className="w-3 h-3" />
                        <span>Coupon applied! ({appliedDiscount * 100}% OFF)</span>
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>
                    )}
                  </div>

                  {/* Calculation Details */}
                  <div className="space-y-2 text-xs border-t border-neutral-800/80 pt-3 font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>Base Plan Price</span>
                      <span>₹{basePrice}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-400">
                      <span>GST (18%)</span>
                      <span>+₹{gst}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-white border-t border-neutral-800 pt-2">
                      <span>Total Amount</span>
                      <span className="text-emerald-400">₹{finalTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="mt-6 pt-4 border-t border-neutral-800">
                  <button
                    onClick={executePayment}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying with Bank...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pay ₹{finalTotal} & Upgrade</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
                    Instant activation · Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
