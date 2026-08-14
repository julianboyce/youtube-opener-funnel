import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

export const TrackingText = ({
  text,
  startFrame = 0,
  durationInFrames = 24,
  fromTracking = -0.12,
  toTracking = 0.08,
  fromScale = 0.82,
  fromBlur = 9,
  style,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [0, 1],
    {...clamp, easing: motionEasing.editorial},
  );

  return (
    <div
      style={{
        letterSpacing: `${fromTracking + (toTracking - fromTracking) * progress}em`,
        scale: fromScale + (1 - fromScale) * progress,
        opacity: progress,
        filter: `blur(${fromBlur * (1 - progress)}px)`,
        willChange: 'letter-spacing, scale, opacity, filter',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
