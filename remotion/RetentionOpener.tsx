import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticTitle} from './KineticTitle';

export type RetentionOpenerProps = {
  channelName: string;
  avatarUrl: string;
};

export const RetentionOpener: React.FC<RetentionOpenerProps> = ({channelName, avatarUrl}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = spring({frame, fps, config: {damping: 13, mass: 0.9, stiffness: 140}});
  const settle = interpolate(frame, [0, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#000', color: '#fff', fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 42, opacity: settle, translate: `${interpolate(entry, [0, 1], [-120, 0])}px 0px`, scale: interpolate(entry, [0, 1], [0.78, 1])}}>
          <Img src={avatarUrl} alt={`${channelName} avatar`} style={{width: 210, height: 210, borderRadius: '50%', objectFit: 'cover', background: '#171717'}} />
          <KineticTitle text={channelName} fontSize={96} maxWidth={560} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
