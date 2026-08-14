import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

export const AccentGeometry = ({
  children,
  kind = 'frame',
  startFrame = 0,
  durationInFrames = 18,
  width = 520,
  height = 220,
  thickness = 5,
  color = '#f3d315',
  rotate = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [0, 1],
    {...clamp, easing: motionEasing.editorial},
  );
  const lineStyle = {position: 'absolute', background: color, borderRadius: 99};

  if (kind === 'line' || kind === 'bar') {
    return (
      <div
        style={{
          position: 'relative',
          width,
          height: kind === 'bar' ? height : thickness,
          rotate: `${rotate}deg`,
          ...style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: color,
            scale: `${progress} 1`,
            transformOrigin: 'left center',
          }}
        />
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>{children}</div>
      </div>
    );
  }

  if (kind === 'rings') {
    return (
      <div style={{position: 'relative', width, height: width, ...style}}>
        {[0, 1].map((ring) => (
          <div
            key={ring}
            style={{
              position: 'absolute',
              inset: ring * 24,
              border: `${thickness}px ${ring ? 'dashed' : 'solid'} ${color}`,
              borderRadius: '50%',
              opacity: progress * (ring ? 0.5 : 0.9),
              scale: progress * (ring ? 0.94 : 1),
              rotate: `${(ring ? -1 : 1) * (45 + rotate) * progress}deg`,
            }}
          />
        ))}
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>{children}</div>
      </div>
    );
  }

  const cornerLength = Math.min(width, height) * 0.22;
  const cornerPositions = [
    {left: 0, top: 0, rotate: 0},
    {right: 0, top: 0, rotate: 90},
    {right: 0, bottom: 0, rotate: 180},
    {left: 0, bottom: 0, rotate: 270},
  ];

  return (
    <div style={{position: 'relative', width, height, rotate: `${rotate * progress}deg`, ...style}}>
      {kind === 'corners' ? cornerPositions.map(({rotate: cornerRotate, ...position}, index) => (
        <div key={index} style={{position: 'absolute', width: cornerLength, height: cornerLength, rotate: `${cornerRotate}deg`, ...position}}>
          <div style={{...lineStyle, left: 0, top: 0, width: cornerLength, height: thickness, scale: `${progress} 1`, transformOrigin: 'left center'}} />
          <div style={{...lineStyle, left: 0, top: 0, width: thickness, height: cornerLength, scale: `1 ${progress}`, transformOrigin: 'center top'}} />
        </div>
      )) : (
        <>
          <div style={{...lineStyle, left: 0, top: 0, width, height: thickness, scale: `${progress} 1`, transformOrigin: 'left center'}} />
          <div style={{...lineStyle, right: 0, top: 0, width: thickness, height, scale: `1 ${progress}`, transformOrigin: 'center top'}} />
          <div style={{...lineStyle, right: 0, bottom: 0, width, height: thickness, scale: `${progress} 1`, transformOrigin: 'right center'}} />
          <div style={{...lineStyle, left: 0, bottom: 0, width: thickness, height, scale: `1 ${progress}`, transformOrigin: 'center bottom'}} />
        </>
      )}
      <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>{children}</div>
    </div>
  );
};
