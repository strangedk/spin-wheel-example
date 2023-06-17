import Signals from "../signals/Signals";
import  {sound} from "@pixi/sound";

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Inversion control
    model.controller = this;
    view.controller = this;

    // Imitate that math is coming from the backend
    Signals.onGetMath.dispatch(model.math);

    // Sounds management
    this.createSounds();
    Signals.onSpinProgress.add(this.playTickSound, this);
    Signals.onSpinStop.add(this.playLandingSound, this);
    Signals.onSpinStop.add(this.playCreditsSound, this);

    // Update the credits total value in the model
    Signals.onSpinStop.add((credit) => this.model.onGotCredits(credit), this);
  }

  /**
   * Specific mapped to wheel angle value
   * @see Map in the model
   * @param value
   */
  spin() {
    const spinData = this.model.getNextSpin();
    this.view.spin(spinData);
  }

  // region #Sounds
  createSounds() {
    sound.add('tick', 'sounds/wheel-click.wav');
    sound.add('landing', 'sounds/wheel-landing.wav');
    sound.add('credits', 'sounds/credits-rollup.wav');
  }

  playTickSound(delta) {
    sound.speed('tick', delta/54)
    sound.play('tick', {volume: 0.12});
  }

  playLandingSound() {
    sound.play('landing');
  }

  playCreditsSound() {
    sound.play('credits');
  }
  // endregion
}

export default Controller;
