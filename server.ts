import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini AI
  const apiKey = process.env.GEMINI_API_KEY;
  let aiClient: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      aiClient = new GoogleGenAI({ apiKey });
      console.log('PostFlow AI: GoogleGenAI client initialized successfully.');
    } catch (err) {
      console.warn('PostFlow AI: Could not initialize GoogleGenAI with key:', err);
    }
  }

  // AI Content Generator Endpoint
  app.post('/api/ai/generate', async (req: Request, res: Response) => {
    try {
      const { prompt, platform = 'Instagram', tone = 'Viral & Engaging', contentType = 'Post Caption', planTier = 'starter' } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      // Feature tier gating validation
      if (contentType === 'video_script' && planTier === 'starter') {
        return res.status(403).json({ error: 'Video script generation requires Pro plan or higher.' });
      }

      if (contentType === 'voice_script' && (planTier === 'starter' || planTier === 'pro')) {
        return res.status(403).json({ error: 'Voice & multimedia scripts require Ultimate plan.' });
      }

      // If Gemini API is available, call gemini-3.8-flash
      if (aiClient) {
        try {
          const systemInstruction = `You are PostFlow AI, a world-class social media strategist and copywriting expert.
Target Platform: ${platform}
Tone of Voice: ${tone}
Format: ${contentType}

Requirements:
1. Provide a magnetic hook that stops the scroll.
2. Structure the body with clear, readable line breaks, emojis where appropriate.
3. Include an enticing Call To Action (CTA).
4. Add 6-9 targeted, non-spammy hashtags relevant to the niche.
5. If format is Video Script, provide Visual cue [VISUAL] and Voiceover cue [AUDIO] scenes.
6. If format is Tweet Thread, format as numbered tweets (1/X, 2/X).`;

          const response = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Generate high-converting content for: "${prompt}".\nPlatform: ${platform}\nTone: ${tone}\nFormat: ${contentType}`,
            config: {
              systemInstruction,
              temperature: 0.75,
            },
          });

          if (response && response.text) {
            return res.json({
              content: response.text,
              source: 'gemini-3.8-flash',
              timestamp: new Date().toISOString(),
            });
          }
        } catch (apiError: any) {
          console.error('Gemini API call failed, generating via fallback engine:', apiError?.message || apiError);
        }
      }

      // Smart curated generation engine fallback
      const smartContent = generateSmartContent(prompt, platform, tone, contentType);
      return res.json({
        content: smartContent,
        source: 'postflow-engine',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('API Error in /api/ai/generate:', err);
      res.status(500).json({ error: 'Internal server error processing AI content.' });
    }
  });

  // Social Auto-Publish Simulation Endpoint
  app.post('/api/social/publish', (req: Request, res: Response) => {
    const { platform, content, mediaUrl, scheduledFor } = req.body;
    const isImmediate = !scheduledFor;
    
    // Simulate real publish processing
    res.json({
      success: true,
      id: 'pf_' + Math.random().toString(36).substring(2, 9),
      platform,
      status: isImmediate ? 'published' : 'scheduled',
      scheduledFor: scheduledFor || new Date().toISOString(),
      publishedAt: isImmediate ? new Date().toISOString() : null,
      message: isImmediate 
        ? `Successfully published to ${platform} live feed!` 
        : `Post queued for auto-publish on ${new Date(scheduledFor).toLocaleString()}.`,
    });
  });

  // Payment Verification Simulation Endpoint
  app.post('/api/payments/verify', (req: Request, res: Response) => {
    const { planId, amount, paymentMethod, upiId, transactionId } = req.body;
    
    res.json({
      success: true,
      transactionId: transactionId || 'TXN_' + Date.now().toString(36).toUpperCase(),
      planId,
      amount,
      paymentMethod,
      upiId: upiId || null,
      status: 'completed',
      receiptUrl: '#',
      activatedAt: new Date().toISOString(),
    });
  });

  // Attach Vite middleware in dev or static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PostFlow AI Server running at http://0.0.0.0:${PORT}`);
  });
}

function generateSmartContent(prompt: string, platform: string, tone: string, contentType: string): string {
  const cleanPrompt = prompt.trim();
  
  if (contentType === 'video_script') {
    return `🎬 [VIDEO SCRIPT - ${platform.toUpperCase()}]
Topic: ${cleanPrompt}
Tone: ${tone}

[0:00 - 0:03] THE HOOK
[VISUAL]: Fast-paced zoom into screen with bold kinetic typography: "Stop scrolling if you want to master ${cleanPrompt}."
[AUDIO]: "Most creators get this completely backwards. Here is what actually happens when you focus on ${cleanPrompt}..."

[0:04 - 0:15] THE PROBLEM
[VISUAL]: Split-screen showing common mistakes vs PostFlow AI automated solution.
[AUDIO]: "You spend 4 hours creating one post, only for it to flop. Why? Because you're not distributing it consistently across all platforms."

[0:16 - 0:40] THE SOLUTION & 3 KEY STEPS
[VISUAL]: Step-by-step breakdown on screen with high-contrast graphic overlays:
• Step 1: Batch your core message (${cleanPrompt})
• Step 2: Repurpose with intelligent aspect ratios (9:16 & 1:1)
• Step 3: Auto-schedule during peak engagement windows
[AUDIO]: "Here are the 3 non-negotiable rules. First, simplify your thesis. Second, optimize for retention. Third, publish on autopilot."

[0:41 - 0:55] CALL TO ACTION
[VISUAL]: Arrow pointing down to comment section and profile link.
[AUDIO]: "Drop a 'FLOW' in the comments and I'll send you our step-by-step template! Save this reel so you don't lose it."

#ContentStrategy #${cleanPrompt.replace(/\s+/g, '')} #SocialMediaGrowth #PostFlowAI #CreatorEconomy #VideoTips`;
  }

  if (contentType === 'carousel_slides') {
    return `📑 [CAROUSEL SLIDES - ${platform.toUpperCase()}]
Topic: ${cleanPrompt}

SLIDE 1 (Cover):
Title: The Ultimate Guide to ${cleanPrompt} 🚀
Subtitle: How to 10x your output without burning out (Swipe Left ➡️)

SLIDE 2 (The Hidden Bottleneck):
"Consistency isn't about working harder. It's about building a multi-channel pipeline."
• 80% of creators quit within 90 days.
• The top 1% use auto-distribution systems.

SLIDE 3 (Framework Part 1):
Focus on the Pillar Concept:
Take 1 core idea (${cleanPrompt}) and derive 5 micro-assets.

SLIDE 4 (Framework Part 2):
Automate Publishing:
Never manually click post at 9 AM on 6 different apps. Schedule once, publish everywhere.

SLIDE 5 (Actionable Summary):
1. Brainstorm with AI
2. Verify analytics
3. Distribute across YouTube, Instagram, X & LinkedIn

SLIDE 6 (CTA):
Did you find this valuable?
❤️ Like | 💬 Comment your thoughts | 🔁 Share with a fellow creator!
Save for later 📌`;
  }

  if (contentType === 'tweet_thread') {
    return `🧵 1/6: Everything you've been told about ${cleanPrompt} is outdated.

Here is the exact playbook we used to scale reach across 6 platforms simultaneously (without hiring an agency): 👇

2/6: The biggest trap is treating each social channel as an isolated island. 
If you create content for Instagram, why isn't that same thesis feeding LinkedIn and X?
Repurposing is the superpower of modern media brands.

3/6: When tackling "${cleanPrompt}", focus on high-retention hooks.
Your first 3 seconds or first 280 characters determine 90% of your virality. Cut the fluff. Lead with the transformation.

4/6: Auto-scheduling is not 'lazy'—it's professional.
The top creators schedule during audience peak hours while they sleep. PostFlow AI handles the queue so you can stay in creative flow.

5/6: Double down on analytics that actually matter:
❌ Vanity likes
✅ Saves, shares, link clicks, and follower conversion rate.

6/6: If you enjoyed this breakdown:
1. Follow @PostFlowAI for daily growth breakdowns
2. Retweet the first post to share with your audience 🚀`;
  }

  // Default Post Caption
  return `Stop overcomplicating ${cleanPrompt}! ✨

If you've been struggling to get consistent traction, here is the exact framework you need to implement today:

1️⃣ Focus on one transformation: Give your audience a clear "before & after".
2️⃣ Optimize for mobile readers: Short sentences, high contrast, clean line breaks.
3️⃣ Schedule in advance: Don't rely on daily motivation—rely on automated workflows.

When you streamline your pipeline with PostFlow AI, you spend less time stressing over algorithms and more time building genuine community.

💬 What is your biggest challenge with ${cleanPrompt}? Let us know in the comments below!

👉 Tap the link in bio to start auto-publishing across all your channels.

#${cleanPrompt.replace(/[^a-zA-Z0-9]/g, '') || 'Growth'} #SocialMediaTips #CreatorHacks #PostFlowAI #Productivity #ContentCreation #OnlineBusiness #ViralStrategy`;
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
