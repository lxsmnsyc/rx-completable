import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const {
    source, cached, observers, subscribed,
  } = this;

  if (!cached) {
    const index = observers.length;
    observers[index] = observer;

    const controller = new AbortController();

    controller.signal.addEventListener('abort', () => {
      observers.splice(index, 1);
    });

    onSubscribe(controller);

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
          this.observers = undefined;
        },
        onError: (x) => {
          this.cached = true;
          this.error = x;

          // eslint-disable-next-line no-restricted-syntax
          for (const obs of observers) {
            obs.onError(x);
          }
          this.observers = undefined;
        },
      });
      this.subscribed = true;
    }
  } else {
    const controller = new AbortController();
    onSubscribe(controller);

    const { error } = this;
    if (error != null) {
      onError(error);
    } else {
      onComplete();
    }
    controller.abort();
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
