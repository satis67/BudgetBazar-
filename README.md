# Budget Bazar v2.0 — Smart AI Marketplace

A "10 years ahead" e-commerce platform built with Next.js 15, AI-powered decision making, and real-time features.

## 🚀 Key Features

- 🤖 **AI Decision Engine**: Smart "APPROVE/REJECT" logic based on your budget and product value.
- 🎬 **Product Reels**: Vertical scroll-snap discovery feed — shop like you're on Instagram.
- ⚡ **Live Auctions**: Real-time bidding with live countdowns and lead bidder tracking.
- 💰 **Budget Intelligence**: Set your monthly limit and let AI guide your spending.
- ⚖️ **Compare Engine**: Intelligent side-by-side product comparison with AI-driven verdicts.
- 🏪 **Seller Portal**: Platinum/Gold/Silver leveling system for sellers with performance analytics.
- 🛡️ **Admin Control**: Complete platform overview, commission tracking, and inventory management.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State**: React Context with LocalStorage persistence
- **AI**: Groq API (LLaMA 3)
- **Database**: Supabase (Foundation for Auth/Real-time)
- **Styling**: Vanilla CSS with modern Glassmorphism UI

## 📦 Setup & Installation

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.local.example` to `.env.local` and add your keys:
   - `GROQ_API_KEY`: Get from [console.groq.com](https://console.groq.com)
   - `NEXT_PUBLIC_SUPABASE_URL`: Get from [supabase.com](https://supabase.com)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Get from [supabase.com](https://supabase.com)

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🛡 License
Free to use for learning and development. Built with ❤️ for the community.
