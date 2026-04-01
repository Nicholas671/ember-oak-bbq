import { useState, useEffect, useRef } from "react";

export function useCountUp(target, duration = 800, start = true) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef(null);
  const animFrame = useRef(null);

  useEffect(() => {
    if (!start || target === 0) {
      setCurrent(target);
      return;
    }

    setCurrent(0);
    startTime.current = null;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(eased * target);

      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    animFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [target, duration, start]);

  return current;
}
