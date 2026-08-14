import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

const mix = (from, to, progress) => from + (to - from) * progress;

const rotationValue = (axis, angle) => {
  if (axis === 'x') return `1 0 0 ${angle}deg`;
  if (axis === 'y') return `0 1 0 ${angle}deg`;
  return `${angle}deg`;
};

export const TransformReveal = ({
  children,
  startFrame = 0,
  durationInFrames = 18,
  fromX = 0,
  fromY = 48,
  fromScale = 0.9,
  fromRotate = 0,
  fromBlur = 8,
  fromOpacity = 0,
  rotateAxis = 'z',
  transformOrigin = '50% 50%',
  clip = true,
  exitStartFrame,
  exitDurationInFrames = 12,
  exitX = 0,
  exitY = -28,
  exitScale = 0.96,
  exitRotate = 0,
  exitBlur = 6,
  style,
  contentStyle,
}) => {
  const frame = useCurrentFrame();
  const entry = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [0, 1],
    {...clamp, easing: motionEasing.editorial},
  );
  const exit = exitStartFrame == null
    ? 0
    : interpolate(
      frame,
      [exitStartFrame, exitStartFrame + Math.max(1, exitDurationInFrames)],
      [0, 1],
      {...clamp, easing: motionEasing.deckAdvance},
    );

  return (
    <div style={{overflow: clip ? 'hidden' : 'visible', perspective: 1200, ...style}}>
      <div
        style={{
          translate: `${mix(fromX, 0, entry) + mix(0, exitX, exit)}px ${mix(fromY, 0, entry) + mix(0, exitY, exit)}px`,
          scale: mix(fromScale, 1, entry) * mix(1, exitScale, exit),
          rotate: rotationValue(rotateAxis, mix(fromRotate, 0, entry) + mix(0, exitRotate, exit)),
          opacity: entry * (1 - exit),
          filter: `blur(${mix(fromBlur, 0, entry) + mix(0, exitBlur, exit)}px)`,
          transformOrigin,
          willChange: 'translate, scale, rotate, opacity, filter',
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};
