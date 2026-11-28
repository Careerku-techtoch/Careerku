import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../theme';

/**
 * Rigged 2D flat editorial illustration of two confused Indonesian college students
 * (male in midnight navy sweater scratching his head + holding laptop,
 *  female in deep emerald sweater & warm cream hijab shrugging + holding smartphone)
 * surrounded by animated floating question marks, trophy, briefcase, grad cap, calendar & chat bubbles.
 *
 * Designed to sit CENTERED in a 1920x1080 frame with clean left & right margins for big Poppins text.
 */
export const ConfusedStudentsRig: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterScale = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // --- MALE STUDENT RIG ANIMATIONS ---
  // Rhythmic head-scratching motion (hand & forearm rock gently against back of head)
  const scratchWave = Math.sin(frame * 0.28);
  const scratchForearmRot = scratchWave * 11; // degrees
  const scratchUpperArmRot = Math.sin(frame * 0.28 - 0.5) * 4.5;
  // Subtle puzzled head tilt & breathing
  const maleHeadTilt = Math.sin(frame * 0.06) * 3.2 - 1.5;
  const maleBreathY = Math.sin(frame * 0.055) * 2.5;
  // Natural eye blink every ~150 frames (2.5s)
  const maleBlinkCycle = frame % 150;
  const maleEyeScaleY =
    maleBlinkCycle > 140 && maleBlinkCycle < 147
      ? interpolate(maleBlinkCycle, [140, 143.5, 147], [1, 0.08, 1])
      : 1;
  // Pupils glancing left-right in confusion
  const malePupilX = Math.sin(frame * 0.045) * 2.4;

  // --- FEMALE STUDENT RIG ANIMATIONS ---
  // Expressive shrug (shoulder & raised open hand lift and tilt periodically)
  const shrugCycle = (Math.sin(frame * 0.085 - 1.0) + 1) / 2; // 0..1 smooth wave
  const femaleShrugY = -shrugCycle * 9;
  const femaleHandRot = -6 + shrugCycle * 14;
  const femaleHeadTilt = Math.sin(frame * 0.065 + 1.2) * 3.8 + 1.2;
  const femaleBreathY = Math.sin(frame * 0.058 + 1.4) * 2.2;
  // Natural eye blink offset from male
  const femaleBlinkCycle = (frame + 68) % 165;
  const femaleEyeScaleY =
    femaleBlinkCycle > 155 && femaleBlinkCycle < 162
      ? interpolate(femaleBlinkCycle, [155, 158.5, 162], [1, 0.08, 1])
      : 1;
  const femalePupilX = Math.cos(frame * 0.05) * 2.0;

  // --- FLOATING ICONS MOTION ---
  const f1 = Math.sin(frame * 0.065) * 8;
  const f2 = Math.cos(frame * 0.058 + 0.8) * 9;
  const f3 = Math.sin(frame * 0.072 + 1.9) * 7;
  const f4 = Math.cos(frame * 0.062 + 2.7) * 8;
  const f5 = Math.sin(frame * 0.055 + 3.5) * 7;
  const f6 = Math.cos(frame * 0.07 + 4.1) * 8;
  const qPulse = 1 + Math.sin(frame * 0.11) * 0.06;

  return (
    <div
      style={{
        width: 860,
        height: 860,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${interpolate(enterScale, [0, 1], [0.9, 1])})`,
      }}
    >
      <svg width="860" height="860" viewBox="0 0 860 860" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft background tangled lines connecting icons */}
        <g opacity="0.55" stroke="#c8cbe4" strokeWidth="2.4" fill="none">
          <ellipse cx="430" cy="370" rx="295" ry="185" transform="rotate(-8 430 370)" />
          <ellipse cx="425" cy="385" rx="255" ry="205" transform="rotate(14 425 385)" />
          <path d="M185 480 C 190 220, 410 155, 595 245 C 715 305, 700 470, 560 535" />
          <path d="M235 240 C 360 320, 480 200, 625 350" />
        </g>

        {/* ================= FLOATING ANIMATED ICONS ================= */}
        {/* 1. Top-Left Question Mark (Lavender) */}
        <g transform={`translate(210, ${172 + f1}) scale(${qPulse})`}>
          <circle cx="0" cy="0" r="36" fill="#d8dcf8" />
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="42"
            fontWeight="800"
            fontFamily="Poppins, sans-serif"
          >
            ?
          </text>
        </g>

        {/* 2. Left Trophy Badge (Competitions) */}
        <g transform={`translate(132, ${292 + f2}) rotate(${Math.sin(frame * 0.05) * 5})`}>
          <circle cx="0" cy="0" r="34" fill="#fef3d6" />
          {/* Trophy vector */}
          <path d="M-12 -14 H12 V-2 C12 6 6 11 0 11 C-6 11 -12 6 -12 -2 Z" fill="#eab354" />
          <path d="M-12 -10 H-18 C-18 -2 -14 2 -10 2" stroke="#eab354" strokeWidth="3.2" fill="none" />
          <path d="M12 -10 H18 C18 -2 14 2 10 2" stroke="#eab354" strokeWidth="3.2" fill="none" />
          <rect x="-3" y="10" width="6" height="7" fill="#d99a36" />
          <rect x="-11" y="16" width="22" height="5" rx="2" fill={COLORS.midnight} />
        </g>

        {/* 3. Lower-Left Red Question Mark */}
        <g transform={`translate(115, ${535 + f3}) scale(${qPulse})`}>
          <circle cx="0" cy="0" r="31" fill="#f3a6a6" />
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="36"
            fontWeight="800"
            fontFamily="Poppins, sans-serif"
          >
            ?
          </text>
        </g>

        {/* 4. Top-Center Briefcase (Internships) */}
        <g transform={`translate(475, ${142 + f4}) rotate(${Math.cos(frame * 0.055) * 6})`}>
          <circle cx="0" cy="0" r="38" fill="#e5e8f8" />
          <rect x="-19" y="-11" width="38" height="27" rx="6" fill="#2c335c" />
          <path d="M-8 -11 V-16 C-8 -18 -6 -19 -4 -19 H4 C6 -19 8 -18 8 -16 V-11" stroke="#2c335c" strokeWidth="3.5" fill="none" />
          <rect x="-4" y="-1" width="8" height="7" rx="2" fill="#f5b864" />
        </g>

        {/* 5. Center Chat Bubble (Yellow dots) */}
        <g transform={`translate(432, ${272 + f5})`}>
          <rect x="-36" y="-22" width="72" height="42" rx="12" fill="#f8c973" />
          <path d="M-18 19 L-26 30 L-6 19 Z" fill="#f8c973" />
          <circle cx="-14" cy="-1" r="4" fill="#ffffff" />
          <circle cx="0" cy="-1" r="4" fill="#ffffff" />
          <circle cx="14" cy="-1" r="4" fill="#ffffff" />
        </g>

        {/* 6. Graduation Cap (Scholarships) */}
        <g transform={`translate(528, ${276 + f2}) rotate(${Math.sin(frame * 0.06 + 1) * 5})`}>
          <circle cx="0" cy="0" r="31" fill="#fde3e3" />
          <polygon points="0,-13 20,-4 0,5 -20,-4" fill="#2c335c" />
          <path d="M-11 0 V9 C-11 13 11 13 11 9 V0" fill="#3a4375" />
          <line x1="17" y1="-3" x2="17" y2="11" stroke="#f5b864" strokeWidth="2.5" />
        </g>

        {/* 7. Top-Right Coral Question Mark */}
        <g transform={`translate(628, ${192 + f6}) scale(${qPulse})`}>
          <circle cx="0" cy="0" r="34" fill="#f29b9b" />
          <text
            x="0"
            y="13"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="38"
            fontWeight="800"
            fontFamily="Poppins, sans-serif"
          >
            ?
          </text>
        </g>

        {/* 8. Right Chat Bubble (Lavender) */}
        <g transform={`translate(638, ${332 + f1})`}>
          <rect x="-38" y="-22" width="76" height="44" rx="12" fill="#d3d7f2" />
          <path d="M-20 21 L-28 32 L-8 21 Z" fill="#d3d7f2" />
        </g>

        {/* 9. Right Calendar / Deadline Clock */}
        <g transform={`translate(698, ${436 + f3}) rotate(${Math.sin(frame * 0.07) * 6})`}>
          <circle cx="0" cy="0" r="32" fill="#e5e8f8" />
          <rect x="-15" y="-14" width="30" height="29" rx="5" fill="#fff7ed" stroke="#f5b864" strokeWidth="2.5" />
          <rect x="-15" y="-14" width="30" height="9" rx="3" fill="#f39c9c" />
          <circle cx="0" cy="4" r="7.5" stroke="#2c335c" strokeWidth="2.2" fill="#ffffff" />
          <path d="M0 0 V4 L3 6" stroke="#2c335c" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* 10. Lower-Right Amber Question Mark (clear of shrugging hand) */}
        <g transform={`translate(715, ${525 + f4}) scale(${qPulse})`}>
          <circle cx="0" cy="0" r="30" fill="#f6c26b" />
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="35"
            fontWeight="800"
            fontFamily="Poppins, sans-serif"
          >
            ?
          </text>
        </g>

        {/* ================= MALE STUDENT (LEFT-CENTER, SCRATCHING HEAD) ================= */}
        <g transform={`translate(285, ${535 + maleBreathY})`}>
          {/* Animated Scratching Arm (Behind Head & Reaching Up) */}
          <g
            style={{
              transformOrigin: '62px -60px',
              transform: `rotate(${scratchUpperArmRot}deg)`,
            }}
          >
            {/* Upper Arm (Navy Sleeve) */}
            <path
              d="M52 -72 C 95 -95, 138 -118, 128 -160 C 122 -184, 96 -215, 76 -235"
              stroke={COLORS.midnight}
              strokeWidth="44"
              strokeLinecap="round"
              fill="none"
            />
            {/* Animated Forearm + Hand scratching back of head */}
            <g
              style={{
                transformOrigin: '104px -188px',
                transform: `rotate(${scratchForearmRot}deg)`,
              }}
            >
              <path
                d="M104 -188 C 90 -212, 74 -232, 54 -244"
                stroke={COLORS.midnight}
                strokeWidth="36"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hand / Fingers scratching hair */}
              <ellipse cx="44" cy="-248" rx="22" ry="16" transform="rotate(-18 44 -248)" fill="#efb58d" />
              <circle cx="32" cy="-254" r="7" fill="#efb58d" />
              <circle cx="38" cy="-260" r="6.5" fill="#efb58d" />
              <circle cx="47" cy="-261" r="6" fill="#efb58d" />
            </g>
          </g>

          {/* Torso (Midnight Navy Sweater) */}
          <path
            d="M-92 175 C -96 42, -88 -52, -48 -78 C -22 -94, 34 -94, 62 -76 C 92 -56, 98 35, 92 175 Z"
            fill={COLORS.midnight}
          />
          {/* Pants base */}
          <rect x="-78" y="168" width="156" height="90" rx="10" fill="#17192e" />

          {/* Left Arm holding laptop */}
          <path
            d="M-66 -58 C -106 -12, -118 58, -94 112"
            stroke="#191b33"
            strokeWidth="46"
            strokeLinecap="round"
            fill="none"
          />

          {/* Neck + subtle chin shadow */}
          <rect x="-18" y="-122" width="38" height="46" rx="14" fill="#e6a67d" />

          {/* Animated Male Head Group */}
          <g
            style={{
              transformOrigin: '0px -135px',
              transform: `rotate(${maleHeadTilt}deg)`,
            }}
          >
            {/* Ears */}
            <circle cx="-55" cy="-164" r="13" fill="#e8ab84" />
            <circle cx="53" cy="-164" r="13" fill="#e8ab84" />
            {/* Face */}
            <path
              d="M-54 -195 C -54 -244, 54 -244, 54 -195 C 54 -140, 32 -106, 0 -106 C -32 -106, -54 -140, -54 -195 Z"
              fill="#f3ba92"
            />
            {/* Natural Layered Hair Silhouette with bangs & sideburns (matches intro-student.mp4) */}
            <path
              d="M-59 -178 C -67 -228, -42 -266, 8 -266 C 50 -266, 70 -232, 60 -178 L 53 -172 C 51 -194, 44 -206, 30 -210 L 18 -196 L 12 -214 C -4 -216, -16 -208, -24 -195 L -28 -211 C -42 -206, -50 -194, -52 -172 Z"
              fill="#191d36"
            />
            <path d="M-28 -259 L-42 -275 L-10 -264 Z" fill="#191d36" />
            <path d="M18 -264 L34 -276 L34 -255 Z" fill="#191d36" />

            {/* Eyebrows (furrowed worried) */}
            <path d="M-36 -190 Q-22 -198 -10 -187" stroke="#191d36" strokeWidth="4.2" strokeLinecap="round" fill="none" />
            <path d="M10 -187 Q22 -198 36 -190" stroke="#191d36" strokeWidth="4.2" strokeLinecap="round" fill="none" />

            {/* Eyes (with blinking + confused glancing) */}
            <g transform={`translate(-22, -168) scale(1, ${maleEyeScaleY})`}>
              <circle cx={malePupilX} cy="0" r="4.8" fill="#191d36" />
            </g>
            <g transform={`translate(22, -168) scale(1, ${maleEyeScaleY})`}>
              <circle cx={malePupilX} cy="0" r="4.8" fill="#191d36" />
            </g>

            {/* Glasses */}
            <rect x="-44" y="-183" width="38" height="28" rx="9" stroke="#191d36" strokeWidth="4.2" fill="#ffffff" fillOpacity="0.18" />
            <rect x="6" y="-183" width="38" height="28" rx="9" stroke="#191d36" strokeWidth="4.2" fill="#ffffff" fillOpacity="0.18" />
            <line x1="-6" y1="-170" x2="6" y2="-170" stroke="#191d36" strokeWidth="4.2" />

            {/* Nose & worried frown */}
            <path d="M0 -162 L-3 -149 L3 -147" stroke="#c88660" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M-13 -127 Q0 -137 13 -127" stroke="#b66f53" strokeWidth="3.8" strokeLinecap="round" fill="none" />
          </g>

          {/* Open Laptop held in front */}
          <g transform="translate(-85, 65)">
            <path d="M-92 -28 L72 -28 L58 82 L-78 82 Z" fill="#4f5f8c" />
            <circle cx="-10" cy="24" r="10" fill="#7888b4" />
            <rect x="-78" y="80" width="174" height="14" rx="7" fill="#323b63" />
            {/* Supporting hand under laptop */}
            <path
              d="M-38 82 C -38 106, -4 114, 18 98 C 28 92, 24 80, 12 80 Z"
              fill="#efb58d"
            />
          </g>
        </g>

        {/* ================= FEMALE STUDENT (RIGHT-CENTER, SHRUGGING) ================= */}
        <g transform={`translate(525, ${568 + femaleBreathY})`}>
          {/* Animated Right Shrug Arm & Open Palm */}
          <g
            style={{
              transformOrigin: '62px -10px',
              transform: `translateY(${femaleShrugY}px)`,
            }}
          >
            {/* Emerald Sleeve */}
            <path
              d="M54 -22 C 92 26, 108 62, 146 32"
              stroke={COLORS.emerald}
              strokeWidth="38"
              strokeLinecap="round"
              fill="none"
            />
            {/* Shrugging Open Hand */}
            <g
              style={{
                transformOrigin: '146px 32px',
                transform: `rotate(${femaleHandRot}deg)`,
              }}
            >
              <path
                d="M142 32 C 154 16, 174 10, 194 12 C 202 13, 200 22, 190 23 L178 24 C 192 25, 196 32, 184 34 L172 36 C 180 39, 178 46, 166 46 C 154 46, 144 42, 142 32 Z"
                fill="#efb58d"
              />
            </g>
          </g>

          {/* Torso (Deep Emerald Sweater) */}
          <path
            d="M-84 155 C -88 38, -74 -34, -40 -52 C -14 -66, 26 -66, 52 -50 C 82 -30, 88 40, 86 155 Z"
            fill={COLORS.emerald}
          />
          {/* Skirt / lower top extension */}
          <rect x="-80" y="148" width="162" height="80" rx="8" fill="#09382c" />

          {/* Left Arm holding Smartphone */}
          <path
            d="M-58 -24 C -84 22, -74 72, -26 78"
            stroke="#0a3e30"
            strokeWidth="38"
            strokeLinecap="round"
            fill="none"
          />
          {/* Smartphone */}
          <rect x="-28" y="20" width="44" height="72" rx="9" transform="rotate(-10 -6 56)" fill="#2c335c" />
          <rect x="-23" y="28" width="34" height="54" rx="5" transform="rotate(-10 -6 56)" fill="#4b568a" />
          {/* Hand gripping phone */}
          <ellipse cx="-16" cy="74" rx="18" ry="14" fill="#efb58d" />

          {/* Animated Female Head & Warm Cream Hijab */}
          <g
            style={{
              transformOrigin: '0px -95px',
              transform: `rotate(${femaleHeadTilt}deg)`,
            }}
          >
            {/* Outer Hijab Drape */}
            <path
              d="M-64 -112 C -68 -184, -36 -218, 4 -216 C 48 -214, 72 -176, 66 -108 C 62 -64, 52 -32, 34 -18 C 12 -2, -24 -4, -44 -20 C -60 -36, -62 -72, -64 -112 Z"
              fill="#f6ebd0"
            />
            {/* Subtle Hijab Shadow Fold */}
            <path
              d="M-54 -48 C -22 -24, 24 -24, 52 -48 C 44 -22, 16 -8, -14 -10 C -36 -12, -48 -28, -54 -48 Z"
              fill="#e9d8b4"
            />
            {/* Face Oval */}
            <path
              d="M-44 -130 C -44 -174, 44 -174, 44 -130 C 44 -86, 26 -58, 0 -58 C -26 -58, -44 -86, -44 -130 Z"
              fill="#f3ba92"
            />
            {/* Cheek Blush */}
            <ellipse cx="-26" cy="-102" rx="9" ry="5" fill="#ea9784" opacity="0.55" />
            <ellipse cx="26" cy="-102" rx="9" ry="5" fill="#ea9784" opacity="0.55" />

            {/* Confused Eyebrows */}
            <path d="M-29 -138 Q-17 -144 -7 -136" stroke="#2c2420" strokeWidth="3.8" strokeLinecap="round" fill="none" />
            <path d="M7 -136 Q17 -144 29 -138" stroke="#2c2420" strokeWidth="3.8" strokeLinecap="round" fill="none" />

            {/* Eyes (with blinking & glancing) */}
            <g transform={`translate(-18, -120) scale(1, ${femaleEyeScaleY})`}>
              <circle cx={femalePupilX} cy="0" r="4.6" fill="#2c2420" />
            </g>
            <g transform={`translate(18, -120) scale(1, ${femaleEyeScaleY})`}>
              <circle cx={femalePupilX} cy="0" r="4.6" fill="#2c2420" />
            </g>

            {/* Nose & puzzled expression */}
            <path d="M0 -116 L-2 -106 L3 -104" stroke="#c88660" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M-10 -86 Q0 -93 10 -85" stroke="#b66f53" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  );
};
