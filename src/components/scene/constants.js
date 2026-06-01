export const PHOTOS = [
  '/photos/1690_24.jpg',
  '/photos/1691_16.jpg'
];

// Interaction types drive which object the camera zooms to.
export const INTERACTION_TYPES = {
  NONE: 'none',
  PHOTO: 'photo',
  DEGREE: 'degree',
  CV: 'cv',
  WEBSITE: 'website'
};

// Camera position + lookAt target per interaction type.
export const TARGET_POSITIONS = {
  [INTERACTION_TYPES.NONE]: { x: 0, y: 4, z: 6, lookAt: { x: 0, y: 0, z: 0 } },
  [INTERACTION_TYPES.PHOTO]: { x: 1.8, y: 3.2, z: 2.0, lookAt: { x: 1.8, y: 2.2, z: 0 } },
  [INTERACTION_TYPES.DEGREE]: { x: -2.0, y: 3.2, z: 2.0, lookAt: { x: -2.0, y: 2.5, z: 0 } },
  [INTERACTION_TYPES.CV]: { x: -0.5, y: 2.0, z: 1.7, lookAt: { x: -0.5, y: 1.1, z: 0.7 } },
  [INTERACTION_TYPES.WEBSITE]: { x: 0, y: 2.0, z: 1.5, lookAt: { x: 0, y: 1.1, z: 0.5 } }
};

export const DEFAULT_RESOLUTION_SCALE = 0.75;
