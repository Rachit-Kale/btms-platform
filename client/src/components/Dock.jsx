// Dock.jsx - React Bits Dock Component with Integrated Labels Below Icons

import React, { createContext, useContext, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DockContext = createContext({
  mouseX: null,
  magnification: 64,
  distance: 140,
});

export const Dock = ({
  children,
  className = '',
  magnification = 60,
  distance = 140,
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance }}>
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#101014]/95 border border-zinc-800/90 backdrop-blur-2xl shadow-2xl ${className}`}
      >
        {children}
      </motion.nav>
    </DockContext.Provider>
  );
};

export const DockItem = ({
  children,
  onClick,
  className = '',
  isActive = false,
}) => {
  const ref = useRef(null);
  const { mouseX, distance } = useContext(DockContext);
  const [isHovered, setIsHovered] = useState(false);

  const defaultScale = 1.0;
  const maxScale = 1.15;

  const distanceCalc = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const scaleSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [defaultScale, maxScale, defaultScale]
  );

  const scale = useSpring(scaleSync, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  return (
    <motion.button
      ref={ref}
      style={{ scale }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-3.5 py-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors duration-200 flex-shrink-0 cursor-pointer ${
        isActive
          ? 'bg-lime text-zinc-950 shadow-lime-sm font-black'
          : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/90 border border-zinc-800/60'
      } ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isHovered, isActive });
        }
        return child;
      })}
    </motion.button>
  );
};

export const DockIcon = ({ children, className = '', isActive = false }) => {
  return (
    <div className={`flex items-center justify-center pointer-events-none ${className}`}>
      {children}
    </div>
  );
};

export const DockLabel = ({ children, isActive = false }) => {
  return (
    <span
      className={`text-[11px] font-mono tracking-tight font-bold whitespace-nowrap leading-none transition-colors duration-200 pointer-events-none ${
        isActive ? 'text-zinc-950 font-black' : 'text-zinc-400 group-hover:text-zinc-200'
      }`}
    >
      {children}
    </span>
  );
};
