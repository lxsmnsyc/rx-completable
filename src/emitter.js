import { Cancellable, BooleanCancellable } from 'rx-cancellable';

/**
 * @ignore
 */
const LINK = new WeakMap();
/**
 * Abstraction over a CompletableObserver that allows associating
 * a resource with it.
 *
 * Calling onComplete() multiple times has no effect.
 * Calling onError(Error) multiple times or after onComplete
 * has no effect.
 */
// eslint-disable-next-line no-unused-vars
export default class CompletableEmitter extends Cancellable {
  constructor(complete, error) {
    super();
    /**
     * @ignore
     */
    this.complete = complete;
    /**
     * @ignore
     */
    this.error = error;

    LINK.set(this, new BooleanCancellable());
  }

  /**
   * Returns true if the emitter is cancelled.
   * @returns {boolean}
   */
  get cancelled() {
    return LINK.get(this).cancelled;
  }

  /**
   * Returns true if the emitter is cancelled successfully.
   * @returns {boolean}
   */
  cancel() {
    return LINK.get(this).cancel();
  }

  /**
   * Set the given Cancellable as the Emitter's cancellable state.
   * @param {Cancellable} cancellable
   * The Cancellable instance
   * @returns {boolean}
   * Returns true if the cancellable is valid.
   */
  setCancellable(cancellable) {
    if (cancellable instanceof Cancellable) {
      if (this.cancelled) {
        cancellable.cancel();
      } else if (cancellable.cancelled) {
        this.cancel();
        return true;
      } else {
        const link = LINK.get(this);
        LINK.set(this, cancellable);
        link.cancel();
        return true;
      }
    }
    return false;
  }

  /**
   * Emits a completion.
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onComplete() {
    if (this.cancelled) {
      return;
    }
    try {
      this.complete();
    } finally {
      this.cancel();
    }
  }

  /**
   * Emits an error value.
   * @param {!Error} err
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onError(err) {
    let report = err;
    if (!(err instanceof Error)) {
      report = new Error('onError called with a non-Error value.');
    }
    if (this.cancelled) {
      return;
    }
    try {
      this.error(report);
    } finally {
      this.cancel();
    }
  }
}
