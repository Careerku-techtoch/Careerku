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
 * Scene 2 (8.25s = 495 frames @ 60fps):
 * Uses the user's uploaded animated video (intro-student.mp4) as the opening visual hook.
 * - 0:00–0:03 (frames 0–180): Student typing & celebrating at desk -> right-column text
 * - 0:03–0:08.25 (frames 180–495): Student standing with trophy/briefcase/verified stream -> right-side headline + floating pills
 */
export const Scene2Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(frame, [475, 495], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Part A text (over 0:00–0:03 while student sits at desk on left)
  const partAIn = spring({
    frame: frame - 18,
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const partAOut = interpolate(frame, [156, 178], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Part B text (over 0:03–0:08.25 while student stands with trophy/briefcase/verified stream)
  const partB1 = spring({
    frame: frame - 196,
    fps,
    config: { damping: 16, stiffness: 125 },
  });
  const partB2 = spring({
    frame: frame - 265,
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

  // Soft audio fade-out at end of clip
  const videoVolume = interpolate(frame, [0, 20, 440, 490], [0, 0.55, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgCream,
        fontFamily: POPPINS_FONT,
        opacity: enterOpacity * exitOpacity,
        overflow: 'hidden',
      }}
    >
      {/* Uploaded Student Animation Clip */}
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

      {/* Part A Typography (frames 0–180): cleanly in the open cream wall on the right */}
      <div
        style={{
          position: 'absolute',
          right: 90,
          top: 310,
          width: 600,
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
            backgroundColor: COLORS.emeraldSoft,
            color: COLORS.emerald,
            padding: '8px 18px',
            borderRadius: 999,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Every Student&apos;s Goal
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.14,
            letterSpacing: '-0.025em',
            color: COLORS.midnight,
            textShadow: TEXT_SHADOW_SOFT,
          }}
        >
          Dreaming of your
          <br />
          next big break?
        </div>
      </div>

      {/* Part B Floating Category Pills (frames 195–495) */}
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

      {/* Part B Typography (frames 195–495): right open area below the icons */}
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
              top: 430,
              width: 880,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div
              style={{
                opacity: partB1,
                transform: `translateY(${interpolate(partB1, [0, 1], [32, 0], { easing: EASE_OUT_EXPO })}px)`,
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.14,
                letterSpacing: '-0.025em',
                color: COLORS.emerald,
                textShadow: TEXT_SHADOW_SOFT,
              }}
            >
              Top internships,
              <br />
              national competitions,
              <br />
              &amp; dream scholarships.
            </div>
            <div
              style={{
                opacity: partB2,
                transform: `translateY(${interpolate(partB2, [0, 1], [24, 0], { easing: EASE_OUT_EXPO })}px)`,
                fontSize: 32,
                fontWeight: 600,
                color: COLORS.midnight,
                letterSpacing: '-0.015em',
              }}
            >
              Everything you need to level up your career.
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
