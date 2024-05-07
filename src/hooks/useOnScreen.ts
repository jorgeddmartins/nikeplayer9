import { RefObject, useState, useEffect } from 'react';

export default function useOnScreen(
  ref: RefObject<HTMLElement | null>,
  oneway: boolean,
  options?: unknown
) {
  const [isIntersecting, setIntersecting] = useState(false);
  const observer = new IntersectionObserver(([entry]) => {
    setIntersecting(
      oneway
        ? entry.isIntersecting || entry.boundingClientRect.top > 0
        : entry.isIntersecting
    );
  }, options);

  useEffect(() => {
    if (ref && ref.current) {
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isIntersecting;
}
