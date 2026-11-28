import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, EASE_OUT_EXPO, POPPINS_FONT, TEXT_SHADOW_SOFT } from '../theme';

/**
 * Scene 4 — Solution Turn with User's Happy Video Clip (8.0s = 480 frames @ 60fps):
 * Creates the emotional Before (Confused Students) -> After (Confident & Ready with Careerku) contrast!
 * - 0:00–0:03 (0–180f): Student coding & cheering -> "Meet Careerku — One AI hub that scrapes it all for you."
 * - 0:03–0:08 (180–480f): Student standing with trophy/briefcase/verified stream -> "Internships, competitions, & scholarships — all verified daily."
 */
export const Scene4SolutionVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [462, 480], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const partAIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const partAOut = interpolate(frame, [156, 178], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const partB1 = spring({
    frame: frame - 196,
    fps,
    config: { damping: 16, stiffness: 125 },
  });
  const partB2 = spring({
    frame: frame - 262,
    fps,
    config: { damping: 16, stiffness: 125 },
  });

  const floatA = Math.sin(frame * 0.075) * 5;
  const floatB = Math.cos(frame * 0.068) * 5;
  const floatC = Math.sin(frame * 0.082 + 1.2) * 5;

  const streamPills = [
    {
      label: 'Competitions',
      left: 725,
      top: 605,
      delay: 215,
      dy: floatA,
      border: '#f5d08a',
      fg: COLORS.midnight,
      dot: '#f59e0b',
    },
    {
      label: 'Internships',
      left: 910,
      top: 112,
      delay: 235,
      dy: floatB,
      border: COLORS.indigoSoft,
      fg: COLORS.midnight,
      dot: COLORS.indigo,
    },
    {
      label: 'Scholarships',
      left: 1300,
      top: 180,
      delay: 255,
      dy: floatC,
      border: COLORS.emeraldSoft,
      fg: COLORS.emerald,
      dot: COLORS.emeraldBright,
    },
  ];

  const videoVolume = interpolate(frame, [0, 20, 430, 476], [0, 0.55, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fdfcf3',
        fontFamily: POPPINS_FONT,
        opacity: enterOpacity * exitOpacity,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('intro-student.mp4')}
          volume={videoVolume}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* Part A: Meet Careerku (frames 0–180) */}
      <div
        style={{
          position: 'absolute',
          right: 85,
          top: 290,
          width: 610,
          opacity: partAIn * partAOut,
          transform: `translateY(${interpolate(partAIn, [0, 1], [30, 0], { easing: EASE_OUT_EXPO })}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 18,
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.emerald,
            color: '#ffffff',
            padding: '9px 20px',
            borderRadius: 999,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
          }}
        >
          ✦ Meet Careerku
        </div>
        <div
          style={{
            fontSize: 50,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: COLORS.midnight,
            textShadow: TEXT_SHADOW_SOFT,
          }}
        >
          One AI hub that scrapes it all for you.
        </div>
      </div>

      {/* Part B: Floating Category Pills */}
      {frame >= 195 &&
        streamPills.map((pill) => {
          const pop = spring({
            frame: frame - pill.delay,
            fps,
            config: { damping: 13, stiffness: 170 },
          });
          return (
            <div
              key={pill.label}
              style={{
                position: 'absolute',
                left: pill.left,
                top: pill.top,
                transform: `translateY(${pill.dy}px) scale(${pop})`,
                backgroundColor: '#ffffff',
                border: `1.5px solid ${pill.border}`,
                color: pill.fg,
                padding: '8px 18px',
                borderRadius: 999,
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                boxShadow: '0 10px 24px rgba(28, 30, 33, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  backgroundColor: pill.dot,
                }}
              />
              {pill.label}
            </div>
          );
        })}

      {/* Part B: Verified Daily Solution Copy */}
      {frame >= 188 && (
        <>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 1120,
              height: 700,
              background:
                'radial-gradient(ellipse at 74% 68%, rgba(253, 252, 243, 0.90) 0%, rgba(253, 252, 243, 0.55) 55%, rgba(253, 252, 243, 0) 85%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 930,
              top: 425,
              width: 880,
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
            }}
          >
            <div
              style={{
                opacity: partB1,
                transform: `translateY(${interpolate(partB1, [0, 1], [32, 0], { easing: EASE_OUT_EXPO })}px)`,
                fontSize: 54,
                fontWeight: 700,
                lineHeight: 1.14,
                letterSpacing: '-0.025em',
                color: COLORS.emerald,
                textShadow: TEXT_SHADOW_SOFT,
              }}
            >
              Internships, competitions,
              <br />
              &amp; scholarships —
              <br />
              all verified daily.
            </div>
            <div
              style={{
                opacity: partB2,
                transform: `translateY(${interpolate(partB2, [0, 1], [24, 0], { easing: EASE_OUT_EXPO })}px)`,
                fontSize: 30,
                fontWeight: 600,
                color: COLORS.midnight,
                letterSpacing: '-0.015em',
              }}
            >
              No more endless scrolling. Just real opportunities.
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
