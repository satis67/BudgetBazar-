'use client';
import { useState, useEffect } from 'react';
import { AUCTIONS, PRODUCTS } from '../../lib/data';
import type { Auction } from '../../lib/types';

function AuctionCard({ auction }: { auction: Auction }) {
  const [timeLeft, setTimeLeft] = useState(auction.endsAt - Date.now());
  const [bid, setBid] = useState('');
  const [currentBid, setCurrentBid] = useState(auction.currentBid);
  const [bidCount, setBidCount] = useState(auction.bids);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(auction.endsAt - Date.now()), 1000);
    return () => clearInterval(t);
  }, [auction.endsAt]);

  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  const placeBid = () => {
    const amount = parseInt(bid);
    if (!amount || amount <= currentBid) { setStatus('❌ Bid must be higher than current bid'); return; }
    setCurrentBid(amount);
    setBidCount(b => b + 1);
    setBid('');
    setStatus(`✅ Bid of ₹${amount.toLocaleString()} placed!`);
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="auction-card">
      <div style={{ position: 'relative' }}>
        <img className="auction-img" src={auction.productImage} alt={auction.productName} loading="lazy" />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239,68,68,0.9)', padding: '0.3rem 0.7rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700 }}>
          <span className="live-dot" style={{ background: 'white' }}></span> LIVE
        </div>
      </div>
      <div className="auction-body">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{auction.productName}</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div className="text-muted text-sm">Current Bid</div>
            <div className="auction-bid gradient-text">₹{currentBid.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-muted text-sm">Ends In</div>
            <div className="timer-box">
              <span className="timer-digit">{pad(h)}</span>
              <span className="timer-colon">:</span>
              <span className="timer-digit">{pad(m)}</span>
              <span className="timer-colon">:</span>
              <span className="timer-digit">{pad(s)}</span>
            </div>
          </div>
        </div>

        <div className="text-muted text-sm mb-2">Lead bidder: <strong>{auction.leadBidder}</strong> · {bidCount} bids</div>

        {status && <div className={`alert ${status.startsWith('✅') ? 'alert-success' : 'alert-danger'} mb-2`}>{status}</div>}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="number" placeholder={`Min ₹${(currentBid + 100).toLocaleString()}`} value={bid} onChange={e => setBid(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={placeBid}>Bid Now</button>
        </div>
      </div>
    </div>
  );
}

export default function AuctionPage() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Live Auctions</h1>
            <span className="live-dot"></span>
          </div>
          <p className="text-muted">Real-time bidding. New auctions every hour. Best deals for fast movers.</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div><div className="stat-value">3</div><div className="stat-label">Active Auctions</div></div>
            <div><div className="stat-value" style={{ color: 'var(--accent)' }}>131</div><div className="stat-label">Total Bids Today</div></div>
            <div><div className="stat-value" style={{ color: 'var(--warning)' }}>₹2.67L</div><div className="stat-label">Total Bid Value</div></div>
            <div><div className="stat-value" style={{ color: 'var(--secondary)' }}>12</div><div className="stat-label">Auctions Won Today</div></div>
          </div>
        </div>

        <div className="grid-3">
          {AUCTIONS.map(a => <AuctionCard key={a.id} auction={a} />)}
        </div>
      </div>
    </div>
  );
}
