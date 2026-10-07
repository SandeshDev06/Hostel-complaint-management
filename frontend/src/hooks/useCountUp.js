import { useEffect, useState } from 'react';

// Animates a number from 0 to `target`.
export default function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const end = Number(target);
    if (!Number.isFinite(end)) return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
