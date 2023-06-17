import * as signals from "signals";

const add = () => new signals.Signal()

export default {
  onInit : add(),
  onGetMath : add(),

  onSpinStart : add(),
  onSpinProgress : add(),
  onSpinStop : add(),

  updateUI : add(),
  onGotCredits : add(),
}
