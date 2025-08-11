'use client';
import { useTextReveal } from "../../hooks/useAdvancedScrollEffects";

export default function AnimatedTitle({ text, className = "", ...props }) {
  const [titleRef, getRevealedText] = useTextReveal({
    delay: 50,
    randomize: true,
    threshold: 0.5
  });

  return (
    <div ref={titleRef} className={`${className} overflow-hidden`} {...props}>
      <span className="inline-block">
        {getRevealedText()}
      </span>
    </div>
  );
}
