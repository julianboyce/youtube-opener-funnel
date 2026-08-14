import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticTitle} from './KineticTitle';

export const DemoOpener: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const badgeEntry = spring({frame, fps, config: {damping: 13, mass: 0.8, stiffness: 150}});

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#35204e', fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Img src={staticFile('opener-demo.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,23,51,.37), rgba(8,23,51,.03) 75%)'}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, padding: '0 80px'}}>
        <div style={{width: 118, height: 118, borderRadius: '50%', border: '3px solid rgba(255,255,255,.92)', display: 'grid', placeItems: 'center', flexShrink: 0, scale: interpolate(badgeEntry, [0, 1], [0.4, 1]), rotate: `${interpolate(badgeEntry, [0, 1], [-35, 0])}deg`}}>
          <div style={{width: 30, height: 30, borderRadius: '50%', background: '#ffd333'}} />
        </div>
        <KineticTitle text="Adventure Awaits" fontSize={54} maxWidth={310} startFrame={9} />
      </div>
      <div style={{position: 'absolute', left: 28, bottom: 23, width: 47, height: 47, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#fff', opacity: interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{width: 0, height: 0, marginLeft: 4, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '14px solid #0d2341'}} />
      </div>
    </AbsoluteFill>
  );
};
