'use client'
import { useState, useEffect } from 'react';

interface FadeProps {
  in: boolean;
  timeout: number;
  children: React.ReactNode;
}
const Fade = ({ in: isIn, timeout, children }: FadeProps) => {
  const [visible, setVisible] = useState(isIn);
  const [fadeStyle, setFadeStyle] = useState<{ opacity: number; transition: string }>({
    opacity: isIn ? 1 : 0,
    transition: `opacity ${timeout}ms`,
  });

  useEffect(() => {
    if (isIn) {
      setVisible(true);
      setFadeStyle({ opacity: 1, transition: `opacity ${timeout}ms` });
    } else {
      setFadeStyle({ opacity: 0, transition: `opacity ${timeout}ms` });
      setTimeout(() => setVisible(false), timeout);
    }
  }, [isIn, timeout]);

  return visible ? <div style={fadeStyle}>{children}</div> : null;
};

interface BoxProps {
  margin: string;
  children: React.ReactNode;
}
const Box = ({ margin, children }: BoxProps) => {
  const boxStyle = {
    display: "flex",
    margin: margin,
  };

  return <div style={boxStyle}>{children}</div>;
};

const DURATION = 1.4;

interface DotProps {
  delay: number;
}
const Dot = ({ delay }: DotProps) => {
  return (
    <div
      className={`mb-[4px] mr-[4px] size-[4px] animate-dot rounded-full bg-light`}
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
};

interface TypingProps {
  isInteractionEnd: boolean;
}
const Typing = ({ isInteractionEnd }: TypingProps) => {
  return (
    <Fade in={!isInteractionEnd} timeout={500}>
      <Box margin="0 0 20px 20px">
        <Dot delay={0} />
        <Dot delay={DURATION * 0.25} />
        <Dot delay={DURATION * 0.5} />
      </Box>
    </Fade>
  );
};

export default Typing;
