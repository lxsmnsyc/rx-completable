import AbortController from 'abort-controller';
import { cleanObserver } from '../utils';
import Completable from '../../completable';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const { source, other } = this;

  other.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      source.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onError(x) {
          onError(x);
          controller.abort();
        },
      });
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
  });
}

/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.other = other;
  return completable;
};
