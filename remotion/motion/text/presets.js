/**
 * Serializable kinetic-text preset metadata. Keep this separate from the JSX
 * implementation so Node.js tooling can catalogue and validate presets.
 */
export const KINETIC_TEXT_PRESETS = [
  {id: 'radial-badge', name: 'Radial Badge'},
  {id: 'pivot-stack', name: 'Progressive Pivot Stack'},
  {id: 'impact-cycle', name: 'Impact Word Cycle'},
  {id: 'split-quote', name: 'Split Quote Stack'},
  {id: 'glyph-orbit', name: 'Glyph Orbit Assemble'},
  {id: 'emphasis-stack', name: 'Emphasis Stack'},
  {id: 'hinged-lockup', name: 'Hinged Lockup'},
  {id: 'slice-title', name: 'Scanline Slice Title'},
  {id: 'orbital-lockup', name: 'Orbital Title Lockup'},
  {id: 'carrier-band', name: 'Carrier Band Stack'},
  {id: 'orthogonal-lockup', name: 'Orthogonal Lockup'},
  {id: 'flip-frame', name: 'Flip Framed Title'},
  {id: 'divider-split', name: 'Divider Split'},
  {id: 'tracking-qualifier', name: 'Tracking Qualifier'},
  {id: 'reverse-type', name: 'Reverse Type Stack'},
];

export const KINETIC_TEXT_PRESET_BY_ID = Object.fromEntries(
  KINETIC_TEXT_PRESETS.map((preset) => [preset.id, preset]),
);
