import AbortController from 'abort-controller';
import Completable from '../../completable';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = observer;

  const { source, other } = this;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  other.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      if (!signal.aborted) {
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
      }
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
  const completable = new Completable();
  completable.source = source;
  completable.other = other;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
