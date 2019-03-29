/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import AbortController from 'abort-controller';
import Completable from '../../completable';
import { isIterable, cleanObserver } from '../utils';
import error from './error';

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

  const buffer = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const completable of sources) {
    if (signal.aborted) {
      return;
    }
    if (completable instanceof Completable) {
      buffer.unshift(completable);
    } else {
      onError(new Error('Completable.amb: One of the sources is a non-Completable.'));
      controller.abort();
      break;
    }
  }

  if (signal.aborted) {
    return;
  }

  let pending = buffer.length;
  let current;
  for (const completable of buffer) {
    completable.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        pending -= 1;

        if (pending === 0) {
          onComplete();
          controller.abort();
        }
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  }

  current();
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isIterable(sources)) {
    return error(new Error('Completable.concat: sources is not Iterable.'));
  }
  const completable = new Completable();
  completable.sources = sources;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
