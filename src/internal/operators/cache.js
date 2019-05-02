import { BooleanCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isNull } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const cleaned = cleanObserver(observer);

  const {
    source, cached, observers, subscribed,
  } = this;

  if (!cached) {
    const index = observers.length;
    observers[index] = cleaned;

    const controller = new BooleanCancellable();

    controller.addEventListener('cancel', () => {
      observers.splice(index, 1);
    });

    cleaned.onSubscribe(controller);

    if (!subscribed) {
      source.subscribeWith({
        onSubscribe() {
          // not applicable
        },
        onComplete: () => {
          this.cached = true;

          // eslint-disable-next-line no-restricted-syntax
          for (const obs of observers) {
            obs.onComplete();
          }
          controller.cancel();
          this.observers = undefined;
        },
        onError: (x) => {
          this.cached = true;
          this.error = x;

          // eslint-disable-next-line no-restricted-syntax
          for (const obs of observers) {
            obs.onError(x);
          }
          controller.cancel();
          this.observers = undefined;
        },
      });
      this.subscribed = true;
    }
  } else {
    const controller = new BooleanCancellable();
    cleaned.onSubscribe(controller);

    const { error } = this;
    if (isNull(error)) {
      cleaned.onError(error);
    } else {
      cleaned.onComplete();
    }
    controller.cancel();
  }
}

/**
 * @ignore
 */
export default (source) => {
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.cached = false;
  completable.subscribed = false;
  completable.observers = [];
  return completable;
};
