import {Composition} from 'remotion';
import {Film} from './Film';
import {StyleBrutal} from './previews/StyleBrutal';
import {StyleEditorial} from './previews/StyleEditorial';
import {StyleColor} from './previews/StyleColor';
import {SceneHeritage, SceneStorybook, SceneCinema} from './threed/SceneShowcase';

export const Root: React.FC = () => (
  <>
    <Composition id="Kinetic" component={Film} durationInFrames={1822} fps={30} width={1280} height={720} />
    <Composition id="Preview-Brutal" component={StyleBrutal} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="Preview-Editorial" component={StyleEditorial} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="Preview-Color" component={StyleColor} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="Scene-Storybook" component={SceneStorybook} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="Scene-Heritage" component={SceneHeritage} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="Scene-Cinema" component={SceneCinema} durationInFrames={300} fps={30} width={1080} height={1920} />
  </>
);
