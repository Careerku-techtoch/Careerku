import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ConfusedStudentsRig } from '../components/ConfusedStudentsRig';
import { COLORS, EASE_OUT_EXPO, POPPINS_FONT, TEXT_SHADOW_SOFT } from '../theme';

/**
 * Scene 2 (10.0s = 600 frames @ 60fps):
 * Bikun-style clean layout:
 * - Animated confused students rig CENTERED (head scratching, shrugging, blinking, floating icons)
 * - ZERO badges, ZERO small pills, ZERO subtext bars
 * - Pure BIG BOLD Poppins typography on the LEFT and RIGHT
 */
export const Scene2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(frame, [576, 600], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Left big bold question appears first
  const leftTextIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  // Right big bold follow-up appears cleanly after ~2.8s
  const rightTextIn = spring({
    frame: frame - 195,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fdfcf3',
        fontFamily: POPPINS_FONT,
        opacity: enterOpacity * exitOpacity,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle geometric background accents matching the Careerku illustration style */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <circle cx="110" cy="70" r="145" stroke="#dcdff2" strokeWidth="3" fill="none" />
        <rect x="0" y="180" width="46" height="190" fill="#e6e7f7" opacity="0.7" />
        <rect x="1710" y="0" width="210" height="170" fill="#e8eaf8" opacity="0.6" />
        <circle cx="1710" cy="200" r="56" stroke="#d5d8ee" strokeWidth="3" fill="none" />
        <rect x="1790" y="740" width="130" height="340" fill="#e5e8f8" opacity="0.6" />
        <circle cx="1440" cy="1080" r="150" stroke="#dcdff2" strokeWidth="3" fill="none" />
      </svg>

      {/* CENTER: Live Animated Confused Students Rig (anchored waist-up to bottom edge) */}
      <div
        style={{
          position: 'relative',
          transform: 'translateY(165px) scale(1.14)',
          zIndex: 2,
        }}
      >
        <ConfusedStudentsRig />
      </div>

      {/* LEFT: Big Bold Core Problem Headline (Pure Poppins, No Pills) */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 290,
          width: 495,
          opacity: leftTextIn,
          transform: `translateY(${interpolate(leftTextIn, [0, 1], [36, 0], { easing: EASE_OUT_EXPO })}px)`,
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.028em',
          color: COLORS.emerald,
          textShadow: TEXT_SHADOW_SOFT,
          zIndex: 4,
        }}
      >
        Hard to find
        <br />
        internships,
        <br />
        competitions,
        <br />
        &amp; scholarships?
      </div>

      {/* RIGHT: Big Bold Follow-Up Headline (Pure Poppins, No Pills) */}
      <div
        style={{
          position: 'absolute',
          right: 72,
          top: 390,
          width: 485,
          textAlign: 'right',
          opacity: rightTextIn,
          transform: `translateY(${interpolate(rightTextIn, [0, 1], [36, 0], { easing: EASE_OUT_EXPO })}px)`,
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.028em',
          color: COLORS.midnight,
          textShadow: TEXT_SHADOW_SOFT,
          zIndex: 4,
        }}
      >
        Lost in endless
        <br />
        chats &amp; feeds?
      </div>
    </AbsoluteFill>
  );
};
