import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

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

  const sharedComplete = () => {
    if (!signal.aborted) {
      onComplete();
      controller.abort();
    }
  };
  const sharedError = (x) => {
    if (!signal.aborted) {
      onError(x);
      controller.abort();
    }
  };

  const { source, other } = this;

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete: sharedComplete,
    onError: sharedError,
  });
  other.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete: sharedComplete,
    onError: sharedError,
  });
}
/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }
  const completable = new Completable();
  completable.source = source;
  completable.other = other;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
