export type PlanTier = 'starter' | 'pro' | 'premium' | 'ultimate';

export interface PlanConfig {
  id: PlanTier;
  name: string;
  priceMonthly: number; // in INR (₹)
  priceAnnual: number;
  platformsLimit: number; // e.g. 2, 4, 7, 999
  postsLimit: number; // e.g. 30, 100, 300, 999999
  aiModelTier: 'Basic Text' | 'Text + Image' | 'Advanced AI + Video' | 'Full AI Suite (Voice/Video)';
  analyticsLevel: 'Basic Reach' | 'Detailed Engagement' | 'Advanced Performance' | 'Full Analytics + PDF';
  profilesLimit: number;
  supportLevel: string;
  popular?: boolean;
}

export type SocialPlatformId = 'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'pinterest';

export interface SocialAccount {
  id: SocialPlatformId;
  name: string;
  handle: string;
  avatar: string;
  connected: boolean;
  followers: string;
  lastSync: string;
  category: string;
  scopes: string[];
}

export type ContentFormat = 'post_caption' | 'video_script' | 'carousel_slides' | 'tweet_thread' | 'hashtag_strategy';

export interface PostItem {
  id: string;
  title: string;
  content: string;
  platforms: SocialPlatformId[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:5';
  status: 'draft' | 'scheduled' | 'publishing' | 'published';
  scheduledDate: string; // ISO string or format
  scheduledTime: string;
  publishedAt?: string;
  impressions?: number;
  engagement?: number;
}

export interface PaymentDetails {
  planId: PlanTier;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  currency: 'INR' | 'USD';
  couponCode?: string;
  discountAmount?: number;
}

export type PaymentMethodType = 'upi' | 'cards' | 'netbanking' | 'paypal' | 'apple_pay';
