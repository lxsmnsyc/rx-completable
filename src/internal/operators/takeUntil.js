import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = cleanObserver(observer);

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
      onError(new Error('Completable.takeUntil: Source cancelled by other Completable.'));
      controller.abort();
    },
    onError(x) {
      onError(new Error(['Completable.takeUntil: Source cancelled by other Completable.', x]));
      controller.abort();
    },
  });

  source.subscribeWith({
    onSubscribe(ac) {
      if (signal.aborted) {
        ac.abort();
      } else {
        signal.addEventListener('abort', () => ac.abort());
      }
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
}

/**
 * @ignore
 */
const takeUntil = (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }

  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.other = other;
  return completable;
};

export default takeUntil;
