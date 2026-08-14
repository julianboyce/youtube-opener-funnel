import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

const mix = (from, to, progress) => from + (to - from) * progress;

export const MotionPath = ({
  children,
  startFrame = 0,
  durationInFrames = 24,
  radiusX = 260,
  radiusY = 150,
  startAngle = -150,
  endAngle = 0,
  centerX = 0,
  centerY = 0,
  fromScale = 0.65,
  toScale = 1,
  fromRotate = -35,
  toRotate = 0,
  rotateAlongPath = false,
  counterRotate = false,
  echoes = 0,
  echoDelayFrames = 3,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{position: 'relative', ...style}}>
      {Array.from({length: Math.max(0, echoes) + 1}, (_, echoIndex) => {
        const echoFrame = frame - echoIndex * echoDelayFrames;
        const progress = interpolate(
          echoFrame,
          [startFrame, startFrame + Math.max(1, durationInFrames)],
          [0, 1],
          {...clamp, easing: motionEasing.editorial},
        );
        const angle = mix(startAngle, endAngle, progress);
        const radians = angle * Math.PI / 180;
        const x = centerX + Math.cos(radians) * radiusX * (1 - progress);
        const y = centerY + Math.sin(radians) * radiusY * (1 - progress);
        const pathRotate = rotateAlongPath ? angle + 90 : mix(fromRotate, toRotate, progress);
        const rotation = counterRotate ? -pathRotate : pathRotate;
        const isMain = echoIndex === 0;
        const opacity = isMain
          ? progress
          : interpolate(progress, [0, 0.45, 1], [0, 0.2 / echoIndex, 0], clamp);

        return (
          <div
            key={echoIndex}
            aria-hidden={!isMain}
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${x}px ${y}px`,
              scale: mix(fromScale, toScale, progress),
              rotate: `${rotation}deg`,
              opacity,
              filter: `blur(${isMain ? mix(8, 0, progress) : 4 + echoIndex * 2}px)`,
              transformOrigin: '50% 50%',
              willChange: 'translate, scale, rotate, opacity, filter',
            }}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
};
