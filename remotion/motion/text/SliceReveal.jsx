import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

const mix = (from, to, progress) => from + (to - from) * progress;

export const SliceReveal = ({
  children,
  slices = 7,
  axis = 'horizontal',
  startFrame = 0,
  durationInFrames = 22,
  staggerFrames = 1,
  offset = 130,
  style,
  contentStyle,
}) => {
  const frame = useCurrentFrame();
  const sliceCount = Math.max(2, Math.round(slices));

  return (
    <div style={{position: 'relative', minHeight: '1.08em', ...style}}>
      {Array.from({length: sliceCount}, (_, index) => {
        const progress = interpolate(
          frame,
          [startFrame + index * staggerFrames, startFrame + index * staggerFrames + Math.max(1, durationInFrames)],
          [0, 1],
          {...clamp, easing: motionEasing.editorial},
        );
        const start = index / sliceCount * 100;
        const end = (index + 1) / sliceCount * 100;
        const horizontal = axis === 'horizontal';
        const clipPath = horizontal
          ? `inset(${start}% 0 ${100 - end}% 0)`
          : `inset(0 ${100 - end}% 0 ${start}%)`;
        const direction = index % 2 === 0 ? -1 : 1;

        return (
          <div
            key={index}
            aria-hidden={index > 0}
            style={{
              position: 'absolute',
              inset: 0,
              clipPath,
              translate: horizontal
                ? `${mix(direction * offset, 0, progress)}px 0`
                : `0 ${mix(direction * offset, 0, progress)}px`,
              opacity: progress,
              filter: `blur(${mix(7, 0, progress)}px)`,
              willChange: 'translate, opacity, filter',
              ...contentStyle,
            }}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
};
