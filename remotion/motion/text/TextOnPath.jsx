import React, {useId} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

export const TextOnPath = ({
  text,
  children,
  startFrame = 0,
  durationInFrames = 24,
  size = 430,
  radius = 170,
  repeats = 2,
  color = '#f3d315',
  fontSize = 24,
  fontWeight = 800,
  letterSpacing = 4,
  rotation = 90,
  style,
}) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/:/g, '');
  const progress = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [0, 1],
    {...clamp, easing: motionEasing.editorial},
  );
  const center = size / 2;
  const path = `M ${center - radius},${center} a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 ${-radius * 2},0`;
  const repeatedText = Array.from({length: Math.max(1, repeats)}, () => `${text}  •  `).join('');

  return (
    <div style={{position: 'relative', width: size, height: size, ...style}}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'visible',
          opacity: progress,
          scale: 0.72 + progress * 0.28,
          rotate: `${rotation * (1 - progress)}deg`,
        }}
      >
        <defs><path id={id} d={path} /></defs>
        <text fill={color} fontFamily="Arial, Helvetica, sans-serif" fontSize={fontSize} fontWeight={fontWeight} letterSpacing={letterSpacing}>
          <textPath href={`#${id}`} startOffset={`${(1 - progress) * 25}%`}>{repeatedText}</textPath>
        </text>
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>{children}</div>
    </div>
  );
};
