/**
 * @interface
 * Represents an object that receives notification from
 * an Emitter.
 */
// eslint-disable-next-line no-unused-vars
export default class Observer {
  /**
   * Receives the AbortController subscription.
   * @param {!AbortController} d
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onSubscribe(d) {}

  /**
   * Receives a completion signal.
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onComplete() {}

  /**
   * Receives an error value.
   * @param {!Error} err
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onError(err) {}
}
