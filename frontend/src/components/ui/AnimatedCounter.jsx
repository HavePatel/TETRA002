import React, { useEffect, useRef, useState } from 'react';

/**
 * Animates a numeric value from 0 to `value` over `duration` ms.
 * Supports prefix/suffix and a custom formatter.
 */
export default function AnimatedCounter({ value, duration = 900, prefix = '', suffix = '', formatter }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const target  = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
    const start   = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  const formatted = formatter
    ? formatter(display)
    : Math.round(display).toLocaleString('en-IN');

  return <span>{prefix}{formatted}{suffix}</span>;
}
