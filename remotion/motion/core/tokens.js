import {Easing} from 'remotion';

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

export const motionEasing = {
  editorial: Easing.bezier(0.16, 1, 0.3, 1),
  settle: Easing.bezier(0.22, 1, 0.36, 1),
  deckAdvance: Easing.bezier(0.76, 0, 0.24, 1),
};
