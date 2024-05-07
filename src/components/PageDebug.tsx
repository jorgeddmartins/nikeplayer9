import { useRef } from 'react';
import { useMount, useWindowSize } from 'react-use';

import createDebug from '../3d/debug';

import s from './PageDebug.module.scss';

const PageDebug = () => {
  const ref = useRef<HTMLCanvasElement>();
  const { width, height } = useWindowSize();
  const debug = useRef<ReturnType<typeof createDebug>>();

  useMount(() => {
    let newScene: typeof debug.current;

    if (ref.current) {
      // set fullscreen
      ref.current.width = window.innerWidth;
      ref.current.height = window.innerHeight;

      // Create and start 3D viz
      newScene = createDebug(ref.current);
      newScene.magic.start();

      debug.current = newScene;
    }
  });

  return (
    <div className={s.container}>
      <canvas ref={ref} width={width} height={height} />
    </div>
  );
};

export default PageDebug;
