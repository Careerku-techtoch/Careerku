import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS } from '../theme';

interface CareerkuBrandMarkProps {
  size?: number;
  inverted?: boolean;
  /** Progress 0..1 for drawing the C arc; defaults to 1 (static) */
  arcProgress?: number;
  /** Frame delay for sparkle pop-in; if omitted sparkles are static at scale 1 */
  sparkleStartFrame?: number;
  frame?: number;
}

export const CareerkuBrandMark: React.FC<CareerkuBrandMarkProps> = ({
  size = 64,
  inverted = false,
  arcProgress = 1,
  sparkleStartFrame,
  frame = 0,
}) => {
  const { fps } = useVideoConfig();
  const arcColor = inverted ? '#FFFFFF' : COLORS.charcoal;

  // Approximate circumference of the open C arc (radius 14.5, ~260deg)
  const arcLength = 72;
  const dashOffset = interpolate(arcProgress, [0, 1], [arcLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const mainSparkleScale =
    sparkleStartFrame !== undefined
      ? spring({
          frame: frame - sparkleStartFrame,
          fps,
          config: { damping: 11, stiffness: 200, mass: 0.7 },
        })
      : 1;

  const smallSparkleScale =
    sparkleStartFrame !== undefined
      ? spring({
          frame: frame - (sparkleStartFrame + 6),
          fps,
          config: { damping: 11, stiffness: 220, mass: 0.6 },
        })
      : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="careerku-sparkle-grad" x1="24" y1="7" x2="43" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={inverted ? '#B8BCFF' : COLORS.indigoBright} />
          <stop offset="100%" stopColor={inverted ? '#8D93FA' : COLORS.indigoLight} />
        </linearGradient>
      </defs>

      {/* Open Geometric "C" Arc */}
      <path
        d="M 26.4 12.6 A 14.5 14.5 0 1 0 35.5 26.5"
        stroke={arcColor}
        strokeWidth="5.8"
        strokeLinecap="butt"
        strokeDasharray={arcLength}
        strokeDashoffset={dashOffset}
      />

      {/* Primary 4-Point AI Sparkle */}
      <g
        style={{
          transformOrigin: '33.5px 16.5px',
          transform: `scale(${mainSparkleScale})`,
        }}
      >
        <path
          d="M 33.5 7.3 Q 34.4 15.6 42.7 16.5 Q 34.4 17.4 33.5 25.7 Q 32.6 17.4 24.3 16.5 Q 32.6 15.6 33.5 7.3 Z"
          fill="url(#careerku-sparkle-grad)"
        />
      </g>

      {/* Companion Small Sparkle */}
      <g
        style={{
          transformOrigin: '41.8px 7.2px',
          transform: `scale(${smallSparkleScale})`,
        }}
      >
        <path
          d="M 41.8 3 Q 42.3 6.7 46 7.2 Q 42.3 7.7 41.8 11.4 Q 41.3 7.7 37.6 7.2 Q 41.3 6.7 41.8 3 Z"
          fill={inverted ? '#C7CBFF' : '#9AA0FA'}
        />
      </g>
    </svg>
  );
};
