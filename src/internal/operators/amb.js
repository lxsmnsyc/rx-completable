import AbortController from 'abort-controller';
import Completable from '../../completable';
import { isIterable, cleanObserver } from '../utils';
import { error } from '../operators';

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

  const { sources } = this;

  const size = sources.length;

  for (let i = 0; i < size; i += 1) {
    if (signal.aborted) {
      return;
    }
    const completable = sources[i];

    if (completable instanceof Completable) {
      completable.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        // eslint-disable-next-line no-loop-func
        onComplete() {
          onComplete();
          controller.abort();
        },
        onError(x) {
          onError(x);
          controller.abort();
        },
      });
    } else {
      onError(new Error('Completable.amb: One of the sources is a non-Completable.'));
      controller.abort();
      break;
    }
  }
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isIterable(sources)) {
    return error(new Error('Completable.amb: sources is not Iterable.'));
  }
  const completable = new Completable();
  completable.sources = sources;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
