/**
 * Provides a mechanism for receiving push-based notification of a valueless
 * completion or an error.
 *
 * When a CompletableObserver is subscribed to a Completable through the
 * Completable.subscribe(CompletableObserver) method, the Completable calls
 * onSubscribe(Cancellable) with a Cancellable that allows cancelling the
 * sequence at any time. A well-behaved Completable will call a CompletableObserver's
 * onError(Error) or onComplete() method exactly once as they are considered
 * mutually exclusive terminal signals.
 *
 * the invocation pattern must adhere to the following protocol:
 *
 * <code>onSubscribe (onError | onComplete)?</code>
 *
 * Subscribing a CompletableObserver to multiple Completables is not recommended.
 * If such reuse happens, it is the duty of the CompletableObserver implementation
 * to be ready to receive multiple calls to its methods and ensure proper concurrent
 * behavior of its business logic.
 *
 * Calling onSubscribe(Cancellable) or onError(Error) with a null argument is forbidden.
 * @interface
 */
// eslint-disable-next-line no-unused-vars
export default class CompletableObserver {
  /**
   * Receives the Cancellable subscription.
   * @param {!Cancellable} d
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
