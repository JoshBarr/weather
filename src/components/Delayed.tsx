import { useEffect, useState } from "react";

type Props = {
  children: React.ReactElement;
  waitFor?: number;
};

export const Delayed: React.FC<Props> = ({ children, waitFor = 500 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitFor);
    return () => clearTimeout(timer);
  }, [waitFor]);

  return isShown ? children : null;
};
