import { NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SMART_RESPONSES: Record<string, string> = {
  'budget': 'Set your budget in the Dashboard and I will warn you if any product exceeds it. You can also filter by price range in the Marketplace.',
  'compare': 'Click "Compare" on any two products in the Marketplace, then visit the Compare page for a side-by-side analysis with AI verdict.',
  'auction': 'Head to the Live Auction page for real-time bidding on premium products at discounted prices!',
  'best': 'Based on ratings and reviews, the top products right now are the MacBook Air M3, Sony WH-1000XM5, and iPhone 16 Pro Max.',
  'cheap': 'Our best budget picks under ₹1,000 are the Atomic Habits book and Badam Rogan Oil. Under ₹5,000 try LeviS Jeans or The Ordinary Serum Bundle.',
  'seller': 'To start selling, go to the Seller Portal, complete your profile, and list your first product. Zero upfront fees!',
};

function getSmartResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(SMART_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return `Thanks for asking about "${message}". I can help you find the best products within your budget, compare items, or navigate to specific categories. What are you looking for today?`;
}

export async function POST(request: Request) {
  const { message, history } = await request.json();

  const groqKey = process.env.GROQ_API_KEY;

  if (groqKey) {
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: 'You are Budget Bazar AI — a smart shopping assistant for an Indian e-commerce marketplace. Help users find the best products, compare items, manage budgets, and get the best deals. Be concise, friendly, and helpful. Always respond in under 80 words.' },
            ...(history || []),
            { role: 'user', content: message }
          ],
          max_tokens: 150,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ reply: data.choices[0].message.content });
      }
    } catch (_) {}
  }

  // Fallback to smart pattern matching
  return NextResponse.json({ reply: getSmartResponse(message) });
}
