class Facade {
  static #instance;
  static getInstance() {
    if (!Facade.#instance)
      return Facade.#instance = new Facade();
    return Facade.#instance;
  }
}
