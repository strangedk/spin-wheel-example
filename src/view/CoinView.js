import * as PIXI from 'pixi.js';
import {Assets} from "pixi.js";

class CoinView extends PIXI.Container {
  constructor(speed = 0.3) {
    super();

    const { animations } = Assets.get('coin');

    this.animatedSprite = new PIXI.AnimatedSprite(animations['coin-anim']);
    this.animatedSprite.anchor.set(0.5);

    this.addChild(this.animatedSprite);
    this.speed = speed;
    this.animatedSprite.play();
  }

  play() {
    this.animatedSprite.play();
  }

  stop() {
    this.animatedSprite.stop();
  }

  destroy(_options) {
    this.animatedSprite.stop();
    this.removeChildren();

    this.animatedSprite.destroy();
    delete this.animatedSprite;

    super.destroy(_options);
  }

  set speed(value) {
    this.animatedSprite.animationSpeed = value;
  }
}

export default CoinView;
