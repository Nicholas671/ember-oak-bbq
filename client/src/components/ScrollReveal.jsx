import { useScrollReveal } from "../hooks/useScrollReveal";

function ScrollReveal({
  children,
  direction = "up",
  delay = "0s",
  duration = "0.7s",
  distance = "30px",
  className = "",
  style = {},
}) {
  const [ref, isVisible] = useScrollReveal();

  const transforms = {
    up: `translateY(${distance})`,
    down: `translateY(-${distance})`,
    left: `translateX(${distance})`,
    right: `translateX(-${distance})`,
  };

  const revealStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate(0, 0)" : transforms[direction],
    transition: `opacity ${duration} cubic-bezier(0.4, 0, 0.2, 1) ${delay}, 
                 transform ${duration} cubic-bezier(0.4, 0, 0.2, 1) ${delay}`,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={revealStyle}>
      {children}
    </div>
  );
}

export default ScrollReveal;
