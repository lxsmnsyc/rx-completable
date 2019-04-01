/**
 * @interface
 * Represents an object that receives notification to
 * an Observer.
 *
 * Emitter is an abstraction layer of the Observer
 */
// eslint-disable-next-line no-unused-vars
export default class Emitter extends AbortController {
  /**
   * Emits a completion signal.
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onComplete() {}

  /**
   * Emits an error value.
   * @param {!Error} err
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onError(err) {}
}
