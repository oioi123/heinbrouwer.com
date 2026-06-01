import { EffectComposer, ToneMapping } from '@react-three/postprocessing';

const Effects = () => {
  return (
    <EffectComposer stencilBuffer={false} disableNormalPass autoClear={false} multisampling={2}>
      {/* Reduced to just ToneMapping for better performance */}
      <ToneMapping />
    </EffectComposer>
  );
};

export default Effects;
