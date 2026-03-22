'use client';
import { useState, useEffect } from 'react';

export default function FlashSaleTimer() {
  const TARGET = new Date();
  TARGET.setHours(TARGET.getHours() + 5, TARGET.getMinutes() + 30, 0, 0);

  const [time, setTime] = useState({ h: 5, m: 30, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, TARGET.getTime() - now);
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="timer-box">
      <span className="timer-digit">{pad(time.h)}</span>
      <span className="timer-colon">:</span>
      <span className="timer-digit">{pad(time.m)}</span>
      <span className="timer-colon">:</span>
      <span className="timer-digit">{pad(time.s)}</span>
    </div>
  );
}
