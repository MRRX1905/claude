import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

export const family = 'Anton';
const handle = delayRender('Loading Anton');
loadFont({family, url: staticFile('Anton-Regular.ttf'), weight: '400'})
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));

export const ANTON = `"Anton", "Arial Black", sans-serif`;
