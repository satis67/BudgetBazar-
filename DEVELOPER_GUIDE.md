# Budget Bazar - Developer Quick Reference

## Project Status Summary

| Category | Status | Details |
|----------|--------|---------|
| **UI/Frontend** | ✅ 100% | All 13 pages, 5 components |
| **State Management** | ✅ 100% | Store + Auth context |
| **APIs Configured** | ✅ 100% | Firebase, Supabase, Razorpay, Groq |
| **Authentication** | ✅ 100% | Email, Google, Phone+OTP |
| **Database Schema** | ❌ 0% | **CRITICAL NEXT STEP** |
| **Database Queries** | ❌ 0% | Using mock data |
| **Payment Webhook** | ❌ 0% | Needs implementation |
| **Real-time Features** | 🟡 50% | UI ready, subscriptions needed |

---

## Getting Started (5 Minutes)

### 1. Clone & Install
```bash
git clone <repo>
cd budgetbazar.com\ ubuntu
npm install
npm run dev
# Visit http://localhost:3000
```

### 2. Environment Setup
```bash
cp .env.local.example .env.local
# Add your actual API keys (ask team lead for dev credentials)
```

### 3. Test Current Features
- ✅ Browse products on homepage
- ✅ Add to cart, wishlist, compare
- ✅ Login with Google/Email
- ✅ View auctions in real-time (UI only)
- ✅ Chat with AI assistant

### 4. What's NOT Working Yet
- ❌ Orders don't save to database
- ❌ User profiles don't persist
- ❌ Payment verification incomplete
- ❌ Auctions not real-time yet

---

## Code Architecture

```
src/
├── app/                          # Next.js pages (all implemented)
│   ├── page.tsx                  # Home (flash sales, categories)
│   ├── marketplace/page.tsx       # Products + filters
│   ├── product/[id]/page.tsx      # Product detail + checkout
│   ├── cart/page.tsx              # Cart management
│   ├── wishlist/page.tsx          # Saved items
│   ├── compare/page.tsx           # Side-by-side comparison
│   ├── auction/page.tsx           # Live auctions
│   ├── reels/page.tsx             # Instagram-style feed
│   ├── dashboard/page.tsx         # User dashboard
│   ├── login/page.tsx             # Sign in
│   ├── register/page.tsx          # Sign up
│   ├── seller/page.tsx            # Seller portal
│   ├── admin/page.tsx             # Admin panel
│   └── api/                       # Backend routes
│       ├── ai/route.ts            # AI chat (Groq)
│       ├── checkout/razorpay/     # Payment orders
│       └── products/route.ts       # Product listing
├── components/                   # Reusable components
│   ├── AIChat.tsx                 # Floating chat widget
│   ├── CheckoutButton.tsx         # Payment button
│   ├── Header.tsx                 # Navigation bar
│   ├── ProductCard.tsx            # Product display
│   └── FlashSaleTimer.tsx         # Countdown timer
├── context/
│   └── AuthContext.tsx            # Firebase auth + user state
├── lib/
│   ├── store.tsx                  # Zustand-like store (context)
│   ├── firebase.ts                # Firebase config
│   ├── supabase.ts                # Supabase client
│   ├── data.ts                    # Mock data (products/auctions/sellers)
│   └── types.ts                   # TypeScript interfaces
└── globals.css                    # Design system

Key Files for Implementation:
- lib/store.tsx          → Persist cart/wishlist to Supabase
- context/AuthContext    → Sync Firebase users to Supabase
- lib/data.ts            → Remove mock data, use real queries
- api/products/route.ts  → Query real database
- api/checkout/          → Create orders, verify payments
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 15.3.6 | React framework |
| react | 19.1.0 | UI library |
| firebase | 11.6.0 | Authentication |
| supabase-js | 2.49.4 | Backend database |
| razorpay | 2.9.6 | Payments |
| framer-motion | 12.6.3 | Animations |
| lucide-react | 0.483.0 | Icons |
| tailwindcss | (inferred) | Styling |

---

## Most Important Files to Know

### 1. `src/lib/store.tsx` (State Management)
- **Purpose:** Cart, wishlist, budget, user data
- **Issue:** Needs to sync with Supabase
- **Action:** Add database queries

### 2. `src/context/AuthContext.tsx` (Auth)
- **Purpose:** Firebase authentication
- **Issue:** User data not saved to Supabase
- **Action:** Add user sync on login

### 3. `src/components/CheckoutButton.tsx` (Payments)
- **Purpose:** Razorpay payment processing
- **Issue:** Payment verification incomplete
- **Action:** Add webhook for payment confirmation

### 4. `src/lib/data.ts` (Mock Data)
- **Purpose:** All products, sellers, auctions
- **Issue:** Hardcoded, needs database
- **Action:** Replace with API calls

### 5. `src/app/api/` (Backend Routes)
- **Purpose:** AI chat, payments, products
- **Issue:** No real database queries (except AI)
- **Action:** Implement database integration

---

## Common Tasks & How-To

### Add a New Component
```typescript
// 1. Create src/components/MyComponent.tsx
'use client';
import { useStore } from '../lib/store';

export default function MyComponent() {
  return <div>Component</div>;
}

// 2. Import and use in pages
import MyComponent from '@/components/MyComponent';
```

### Create a New API Route
```typescript
// Create src/app/api/myroute/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Your logic here
    return NextResponse.json({ data: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Query Database
```typescript
// Use existing fetch wrapper
const response = await fetch('/api/products?category=Electronics');
const { products } = await response.json();

// Or use Supabase directly
import { supabase } from '@/lib/supabase';
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'Electronics');
```

### Add Authentication Check
```typescript
import { useAuth } from '@/context/AuthContext';

export default function ProtectedPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return <div>Protected content</div>;
}
```

---

## Production Deployment Checklist

### Before Going Live
- [ ] All 8 API routes have database queries
- [ ] Razorpay webhook configured and tested
- [ ] Real-time Supabase subscriptions wired up
- [ ] User profiles save and load correctly
- [ ] Orders persist and can be tracked
- [ ] Environment variables set in production
- [ ] HTTPS enabled everywhere
- [ ] Rate limiting on API routes
- [ ] Error logging configured
- [ ] Database backups scheduled

### Estimated Timeline
- **Phase 1 (Database):** 2-3 days
- **Phase 2 (APIs):** 2-3 days
- **Phase 3 (Integration):** 2-3 days
- **Phase 4 (Testing):** 2-3 days
- **Total:** 1-2 weeks

---

## Helpful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Razorpay API](https://razorpay.com/docs/api)
- [Groq API](https://console.groq.com/docs)

### Development Tools
```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code (if prettier installed)
npm run format
```

### VS Code Extensions
- ES7+ React/Redux/Graphql/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma
- Firebase
- Thunder Client (API testing)

---

## Team Responsibilities

### Database Developer
- Create Supabase schema (CRITICAL)
- Implement database queries
- Set up RLS policies
- Handle migrations

### Backend Developer
- Implement API routes with real data
- Create payment webhook
- Build search/filter logic
- Add caching strategies

### Frontend Developer
- Connect components to APIs
- Implement real-time subscriptions
- Add loading/error states
- Performance optimization

### DevOps/Deployment
- Infrastructure setup
- Environment configuration
- Monitoring and logging
- Database backups

---

## Quick Debugging

### Issue: Data not showing up?
```typescript
// Check if Supabase is connected
if (!supabase) console.log('Supabase not initialized');

// Check if query is correct
const { data, error } = await supabase.from('table').select('*');
if (error) console.error('Query failed:', error);
```

### Issue: Payment not working?
- Check Razorpay keys are correct
- Verify order is created before payment
- Check webhook is receiving events
- Test with sandbox credentials first

### Issue: Auth not persisting?
- Check Firebase config
- Verify user is being saved to Supabase
- Check localStorage for auth state
- Inspect RLS policies

### Issue: Auctions not real-time?
- Check Supabase subscription is active
- Verify RLS allows reading auction data
- Check for JavaScript errors in console
- Test with Supabase dashboard

---

## Monthly Maintenance

- [ ] Review and update dependencies
- [ ] Monitor API performance
- [ ] Analyze user feedback
- [ ] Check payment success rates
- [ ] Review database usage
- [ ] Update security policies
- [ ] Backup critical data
- [ ] Performance profiling

---

## Support Contacts

**For questions about:**
- **Frontend/React:** [Your name/team]
- **Backend/APIs:** [Your name/team]
- **Database/Supabase:** [Your name/team]
- **Payments/Razorpay:** [Your name/team]
- **Devops/Deployment:** [Your name/team]

---

## Last Updated
**Date:** March 22, 2026
**Version:** 2.0
**Status:** 90% Complete - Ready for Database Implementation
