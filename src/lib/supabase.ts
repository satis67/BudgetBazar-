import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Real-time Auction Helper
 */
export const subscribeToAuction = (auctionId: string, callback: (payload: any) => void) => {
  if (!supabase) return { unsubscribe: () => {} };
  return supabase
    .channel(`auction:${auctionId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'auctions', filter: `id=eq.${auctionId}` }, callback)
    .subscribe();
};
