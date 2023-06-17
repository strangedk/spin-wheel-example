import { Assets } from 'pixi.js';

async function loadResources() {
  Assets.add('pack', 'assets/pack.json');
  Assets.add('coin', 'assets/coin-anim.json');
  return Assets.load(['pack', 'coin']);
}

export default loadResources;
