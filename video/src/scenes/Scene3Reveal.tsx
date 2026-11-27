import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CareerkuBrandMark } from '../components/CareerkuBrandMark';
import { CARD_SHADOW_ELEVATED, COLORS, EASE_IN_OUT_SMOOTH, POPPINS_FONT } from '../theme';

export const Scene3Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgePop = spring({
    frame: frame - 4,
    fps,
    config: { damping: 13, stiffness: 170 },
  });

  // Morph badge into wide browser shell (3.0s = 180f)
  const morphProgress = interpolate(frame, [52, 128], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT_SMOOTH,
  });

  const width = interpolate(morphProgress, [0, 1], [176, 1280]);
  const height = interpolate(morphProgress, [0, 1], [176, 780]);
  const borderRadius = interpolate(morphProgress, [0, 1], [88, 28]);

  const badgeIconOpacity = interpolate(morphProgress, [0, 0.35], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const splashContentOpacity = interpolate(morphProgress, [0.45, 0.9], [0, 1], {
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
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius,
          backgroundColor: morphProgress < 0.3 ? '#ffffff' : COLORS.bgSage,
          border: `1.5px solid ${COLORS.borderStrong}`,
          boxShadow: CARD_SHADOW_ELEVATED,
          transform: `scale(${badgePop})`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Circular Logo Badge (early frames) */}
        <div
          style={{
            position: 'absolute',
            opacity: badgeIconOpacity,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CareerkuBrandMark size={86} />
        </div>

        {/* Browser Window Skeleton Revealing Inside */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: splashContentOpacity,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Browser Chrome */}
          <div
            style={{
              height: 52,
              backgroundColor: '#ffffff',
              borderBottom: `1px solid ${COLORS.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 22px',
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
            </div>
            <div
              style={{
                backgroundColor: COLORS.bgSubtle,
                border: `1px solid ${COLORS.borderSubtle}`,
                borderRadius: 999,
                padding: '5px 28px',
                fontSize: 13,
                fontWeight: 500,
                color: COLORS.slate,
              }}
            >
              careerku.app/discover
            </div>
            <div style={{ width: 52 }} />
          </div>

          {/* Warm Brand Welcome Splash inside Frame */}
          <div
            style={{
              flex: 1,
              backgroundColor: COLORS.bgCream,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: `1px solid ${COLORS.borderSubtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CareerkuBrandMark size={46} />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.charcoal,
                letterSpacing: '-0.02em',
              }}
            >
              Meet Careerku
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.emerald,
                backgroundColor: COLORS.emeraldSoft,
                padding: '7px 20px',
                borderRadius: 999,
              }}
            >
              AI-Scraped Internships • Competitions • Scholarships
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
