import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CareerkuBrandMark } from '../components/CareerkuBrandMark';
import { COLORS, EASE_OUT_EXPO, POPPINS_FONT } from '../theme';

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arcProgress = interpolate(frame, [4, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT_EXPO,
  });

  // Shift logo left slightly when wordmark slides in
  const lockupShift = spring({
    frame: frame - 30,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const wordmarkOpacity = interpolate(frame, [32, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const wordmarkX = interpolate(frame, [32, 52], [-28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT_EXPO,
  });

  const taglineOpacity = interpolate(frame, [48, 66], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const taglineY = interpolate(frame, [48, 66], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT_EXPO,
  });

  // Exit fade out at end of 2.75s intro scene
  const exitOpacity = interpolate(frame, [145, 165], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgCream,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: POPPINS_FONT,
        opacity: exitOpacity,
      }}
    >
      {/* Subtle decorative radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 720,
          height: 720,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(13, 74, 58, 0.06) 0%, rgba(247, 248, 242, 0) 70%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            transform: `translateX(${interpolate(lockupShift, [0, 1], [95, 0])}px)`,
          }}
        >
          <CareerkuBrandMark
            size={92}
            arcProgress={arcProgress}
            sparkleStartFrame={22}
            frame={frame}
          />
          <div
            style={{
              opacity: wordmarkOpacity,
              transform: `translateX(${wordmarkX}px)`,
              fontSize: 74,
              fontWeight: 700,
              color: COLORS.charcoal,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            Careerku
          </div>
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.emerald,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          AI Opportunity Hub for Students
        </div>
      </div>
    </AbsoluteFill>
  );
};
