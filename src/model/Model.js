import Signals from "../signals/Signals";

class Model {
  constructor() {
    Signals.onInit.add(this.onInit, this);

    this.math = {
        credits: [ 5000, 200, 1000, 400, 2000, 200, 1000, 400, ],
        weights: {
          4:    { angles: [0],            credit: 5000},
          10:   { angles: [180],          credit: 2000},
          20:   { angles: [90, 270],      credit: 1000},
          50:   { angles: [45, 225],      credit: 400},
          100:  { angles: [135, 315],     credit: 200},
        },
    };

    this.percents = this.getWeightPercents();
    this.credits = 0;

    // region #Debug
    window.weights = () => {
      for (let key in this.math.weights) {
        console.info(`weight: ${key} credit: ${this.math.weights[key].credit}`);
      }
    }

    console.log('%c Welcome to the debug information', 'background: #222; color: #bada55');
    console.table(this.math.weights);
    console.log('%c weights(): Output all the weights mapped to the credits.', 'background: #222; color: #bada55');
    console.log('%c weight = N: Selecting the custom weight for the next spin.', 'background: #222; color: #bada55');
    console.log('%c spin(): Invoke spin from the console.', 'background: #222; color: #bada55');
    // endregion
  }

  getWeightPercents() {
    const keys = Object.keys(this.math.weights);
    const totalWeight =  keys.reduce((acc, curr) => +acc + +curr);

    const result = {};

    // Calculate the weight percents depends on weight proportion
    for (let weight of keys)
      result[weight] = +weight / totalWeight * 100;

    return result;
  }

  getNextWeight() {
    const rand = Math.random() * 100;

    // Calculate the chance of next weight depends on proportion/percents
    // @see getWeightPercents
    let lastWeight = 0;
    for (let weight of Object.keys(this.percents)) {
      const percent = this.percents[weight];

      if (rand < percent) {
        return weight;
      }
      lastWeight = weight;
    }
    return lastWeight;
  }

  /**
   * Choosing the next weight, angle and credit chance randomly
   * @see getNextWeight
   * @return { weight: number, angle: number, credit: number }
   */
  getNextSpin() {
    let debugWeight = undefined;
    if (window['weight'] && this.math.weights[window['weight']]) {
      debugWeight = window['weight'];
    }

    const weight = debugWeight ? debugWeight : this.getNextWeight();
    const weightData = this.math.weights[weight];
    // The same credit values might be on the same weight value, but on the different angles
    // So here we're select one of them
    const angleIndex = weightData.angles.length === 1
      ? 0
      : Math.floor(Math.random() * weightData.angles.length);
    const angle = weightData.angles[angleIndex];
    const credit = weightData.credit;

    return { weight, angle, credit };
  }

  onGotCredits(value) {
    this.credits += value;

    // Update the UI with the total value of credits
    Signals.updateUI.dispatch(this.credits);
  }

  onInit(data) {
    // NOP
  }
}

export default Model;
