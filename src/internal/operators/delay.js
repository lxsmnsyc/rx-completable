import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { amount, doDelayError } = this;

  let timeout;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  signal.addEventListener('abort', () => {
    if (typeof timeout !== 'undefined') {
      clearTimeout(timeout);
    }
  });

  this.source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => {
        ac.abort();
      });
    },
    onComplete() {
      timeout = setTimeout(() => {
        onComplete();
        controller.abort();
      }, amount);
    },
    onError(x) {
      timeout = setTimeout(() => {
        onError(x);
        controller.abort();
      }, doDelayError ? amount : 0);
    },
  });
}
/**
 * @ignore
 */
export default (source, amount, doDelayError) => {
  if (typeof amount !== 'number') {
    return source;
  }
  const completable = new Completable();
  completable.source = source;
  completable.amount = amount;
  completable.doDelayError = doDelayError;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
