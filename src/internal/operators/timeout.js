
import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver, isNumber } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { amount } = this;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const timeout = setTimeout(
    () => {
      onError(new Error('Completable.timeout: TimeoutException (no complete signals within the specified timeout).'));
      controller.abort();
    },
    amount,
  );

  signal.addEventListener('abort', () => {
    clearTimeout(timeout);
  });

  this.source.subscribeWith({
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
}
/**
 * @ignore
 */
export default (source, amount) => {
  if (!isNumber(amount)) {
    return source;
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.amount = amount;
  return completable;
};
