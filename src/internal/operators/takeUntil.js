import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onComplet, onError } = cleanObserver(observer);

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
    onComplet() {
      if (!signal.aborted) {
        onError(new Error('Completable.takeUntil: Source cancelled by other Completable.'));
        controller.abort();
      }
    },
    onError(x) {
      if (!signal.aborted) {
        onError(new Error(['Completable.takeUntil: Source cancelled by other Completable.', x]));
        controller.abort();
      }
    },
  });

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplet() {
      if (!signal.aborted) {
        onComplet();
        controller.abort();
      }
    },
    onError(x) {
      if (!signal.aborted) {
        onError(x);
        controller.abort();
      }
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

  const completable = new Completable();
  completable.source = source;
  completable.other = other;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};

export default takeUntil;
