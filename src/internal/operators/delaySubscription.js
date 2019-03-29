import AbortController from 'abort-controller';
import Completable from '../../completable';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = observer;

  const { amount } = this;

  let timeout;

  const controller = new AbortController();

  const { signal } = controller;

  signal.addEventListener('abort', () => {
    if (typeof timeout !== 'undefined') {
      clearTimeout(timeout);
    }
  });

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  timeout = setTimeout(() => {
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
  }, amount);
}
/**
 * @ignore
 */
export default (source, amount) => {
  if (typeof amount !== 'number') {
    return source;
  }
  const completable = new Completable();
  completable.source = source;
  completable.amount = amount;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
