import * as PIXI from 'pixi.js';

class SliceView extends PIXI.Sprite {
  constructor(credit, weight) {
    super();

    this.credit = credit;
    this.weight = weight;

    this
      .createSlice()
      .createText(this.credit, this.weight);

    // this.cacheAsBitmap = true;
  }

  createSlice() {
    this.texture = PIXI.Texture.from('wheel-slice.png');
    this.updateTint();

    return this;
  }

  createText(value) {
    if (this.weight) // To debug
      value += ':' + this.weight;

    const styleOptions = {
      fill: ['#f311ff', '#fa8833'],
      fontWeight: 'bold',
      fontSize: this.weight ? 30 : 110, // To debug
    };
    const style = new PIXI.TextStyle(styleOptions);

    const text = this.text = new PIXI.Text(value, style);
    text.anchor.set(0.5);
    text.x = 0;
    text.y = -150;
    this.addChild(text);
    return this;
  }

  updateTint() {
    this.tint = Math.random() * 0xFFFFFF; // without that, it's looking a little bit boring
  }

  /**
   * Just for debug, setting the value to the custom
   * @param value
   */
  set value(value) {
    this.text.text = value;
  }

  get value() {
    return this.text.text;
  }
}

export default SliceView;
