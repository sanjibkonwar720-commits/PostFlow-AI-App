import { PlanConfig, SocialAccount, PostItem } from '../types';

export const SUBSCRIPTION_PLANS: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 199,
    priceAnnual: 1890,
    platformsLimit: 2,
    postsLimit: 30,
    aiModelTier: 'Basic Text',
    analyticsLevel: 'Basic Reach',
    profilesLimit: 1,
    supportLevel: 'Email Support',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 299,
    priceAnnual: 2870,
    platformsLimit: 4,
    postsLimit: 100,
    aiModelTier: 'Text + Image',
    analyticsLevel: 'Detailed Engagement',
    profilesLimit: 2,
    supportLevel: 'Priority Email',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 399,
    priceAnnual: 3790,
    platformsLimit: 7,
    postsLimit: 300,
    aiModelTier: 'Advanced AI + Video',
    analyticsLevel: 'Advanced Performance',
    profilesLimit: 5,
    supportLevel: 'Chat Support',
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    priceMonthly: 499,
    priceAnnual: 4790,
    platformsLimit: 999,
    postsLimit: 999999,
    aiModelTier: 'Full AI Suite (Voice/Video)',
    analyticsLevel: 'Full Analytics + PDF',
    profilesLimit: 999,
    supportLevel: '24/7 VIP Priority Support',
  },
];

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@SanjibTechChannel',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: '42.8K Subscribers',
    lastSync: '10 mins ago',
    category: 'Long-form & Shorts',
    scopes: ['youtube.upload', 'youtube.readonly'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@sanjib.builds',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: '28.4K Followers',
    lastSync: 'Just now',
    category: 'Reels & Carousels',
    scopes: ['instagram_basic', 'instagram_content_publish'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Sanjib Konwar (Pro)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: '14.2K Connections',
    lastSync: '25 mins ago',
    category: 'Articles & Industry Posts',
    scopes: ['r_liteprofile', 'w_member_social'],
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    handle: '@sanjib_dev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followers: '19.6K Followers',
    lastSync: 'Disconnected',
    category: 'Threads & Quick Takes',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    handle: 'PostFlow Creator Community',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followers: '8.9K Fans',
    lastSync: 'Disconnected',
    category: 'Page Feeds & Events',
    scopes: ['pages_show_list', 'pages_manage_posts'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    handle: 'PostFlow Design Boards',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followers: '5.1K Monthly Viewers',
    lastSync: 'Disconnected',
    category: 'Infographics & Pins',
    scopes: ['boards:read', 'pins:write'],
  },
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    title: '5 Micro-habits that 10x social media engagement',
    content: `Stop chasing the algorithm and start mastering distribution! 🚀

Here are 5 habits top creators use to 10x engagement without burning out:
1. Batch brainstorm with AI
2. Standardize your high-contrast cover art
3. Cross-post to YouTube Shorts & Instagram Reels simultaneously
4. Reply to the first 20 comments within 15 minutes
5. Schedule auto-posts during peak hours using PostFlow AI

Which of these are you trying this week? Drop your thoughts below! 👇

#CreatorEconomy #SocialMediaGrowth #ProductivityHacks #PostFlowAI #GrowthHacking`,
    platforms: ['instagram', 'linkedin', 'twitter'],
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    aspectRatio: '1:1',
    status: 'scheduled',
    scheduledDate: '2026-10-02',
    scheduledTime: '18:30',
    impressions: 0,
    engagement: 0,
  },
  {
    id: 'post-2',
    title: 'Behind the Scenes: Architecture of a 60FPS Video Pipeline',
    content: `Engineers often ask how we sync video transcoding with real-time multi-platform queues. 

Here is our stack breakdown:
- Parallel worker pools for 4K downsampling
- Dynamic watermark & subtitle burn-in
- Webhook notifications for instant delivery confirmation

Read the full engineering deep dive in the comments! 💻✨

#WebDev #FullStack #SystemDesign #SoftwareArchitecture`,
    platforms: ['youtube', 'linkedin'],
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    aspectRatio: '16:9',
    status: 'published',
    scheduledDate: '2026-10-01',
    scheduledTime: '09:00',
    publishedAt: '2026-10-01T09:00:00.000Z',
    impressions: 4890,
    engagement: 342,
  },
  {
    id: 'post-3',
    title: 'How to scale your creative business in 2026',
    content: `Most solo entrepreneurs hit a glass ceiling at $5k/mo because they spend 70% of their workday doing repetitive manual uploads.

Automate your publishing so you can focus purely on product and relationships. 

Save this checklist for your next planning session! 📌`,
    platforms: ['instagram', 'facebook'],
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    aspectRatio: '4:5',
    status: 'scheduled',
    scheduledDate: '2026-10-03',
    scheduledTime: '14:00',
    impressions: 0,
    engagement: 0,
  },
  {
    id: 'post-4',
    title: 'Video Script: The Death of Manual Posting',
    content: `[VISUAL]: Quick jump cuts showing someone frantically opening 5 browser tabs to copy-paste the same caption.
[AUDIO]: "You're still doing this in 2026? There is a smarter way."
[VISUAL]: Transition into PostFlow AI single-click scheduler.
[AUDIO]: "Schedule once, auto-format for Reels, Shorts, and X threads, and watch your metrics climb while you sleep."`,
    platforms: ['youtube', 'instagram'],
    mediaUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    aspectRatio: '9:16',
    status: 'draft',
    scheduledDate: '2026-10-04',
    scheduledTime: '11:15',
  },
];

export const PRESET_SAMPLE_MEDIA = [
  {
    title: 'Neon Cyber Studio',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
  },
  {
    title: 'Modern Creator Desk',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
  },
  {
    title: 'Team Strategy Session',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
  },
  {
    title: 'Urban Reel Footage (Mock MP4)',
    url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
    type: 'video' as const,
  },
];
