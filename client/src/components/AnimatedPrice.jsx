import { useCountUp } from "../hooks/useCountUp";

function AnimatedPrice({ value, prefix = "$" }) {
  const numericValue = parseFloat(value) || 0;
  const animated = useCountUp(numericValue, 600, true);

  return (
    <span>
      {prefix}{animated.toFixed(2)}
    </span>
  );
}

export default AnimatedPrice;
