import { useEffect, RefObject } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  containerRef: RefObject<HTMLElement>;
}

const ScrollToTop = ({ containerRef }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [pathname, containerRef]);

  return null;
};

export default ScrollToTop; 