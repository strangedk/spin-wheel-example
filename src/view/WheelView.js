import * as PIXI from 'pixi.js';
import SliceView from "./SliceView";

class WheelView extends PIXI.Sprite {
  constructor(math) {
    super();

    this.math = math;

    this.anchor.set(0.5);
    this.slices = [];
    this.updateDelta = 0;

    this
      .createSlices() // 370 * 480
      .createCenter() // 256 * 256
      .arrangeSlices();
  }

  createSlices() {
    this.slices = this.math.credits.map(credit => {
      const slice = new SliceView(credit, 0);
      slice.anchor.set(0.5);
      this.addChild(slice);
      return slice;
    });

    return this;
  }

  createCenter() {
    const center = new PIXI.Sprite();
    center.texture = PIXI.Texture.from('wheel-center.png');
    center.pivot.set(0.5);
    center.position.set(-128, -128);
    this.addChild(center);

    return this;
  }

  arrangeSlices() {
    const options = [
      { x: 0, y: -250, },       // top
      { x: 175, y: -175, },     // top-right
      { x: 250, y: 0, },        // right
      { x: 175, y: 175, },      // bottom-right

      { x: 0, y: 250, },        // bottom
      { x: -175, y: 175, },     // bottom-left
      { x: -250, y: 0, },       // left
      { x: -175, y: -175, },    // top-left
    ];

    // Simple and straight approach
    for (let i = 0; i < this.slices.length; ++i) {
      const slice = this.slices[i];
      const {x, y} = options[i];

      slice.position.set(x,y);
      slice.rotation = (i * 45) * (Math.PI/180); // To radians from the degrees

      // credits : weight : angle // for the debug
      if (slice.weight)
        slice.value = slice.value + ' : ' + i*45;
    }
    return this;
  }

  /**
   * set Angle in degrees
   */
  set angle(value) {
    this.updateDelta += 1;
    if (this.updateDelta > 360)
      this.updateDelta = 0;

    if (this.updateDelta % 14 === 0)
      for (let slice of this.slices)
        slice.updateTint(); // to make it more interactive and fun

    this.rotation = value * (Math.PI/180);
  }

  /*
    this.slices.forEach((slice, index) => {

    // The Math arrangement approach, didn't finish that. But tried.
    // this.addChild(slice);
    // const corner = 370 / 2;
    // const x = 1216 / 2 + corner * Math.cos(index * Math.PI/4 + Math.PI/8);
    // const y = 1216 / 2 + corner * Math.sin(index * Math.PI/4 + Math.PI/8);
    // slice.position.set(x,y);
    // slice.rotation = index * 45 * (Math.PI/180);

    });

   */
}

export default WheelView;
