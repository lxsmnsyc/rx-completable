/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import { CompositeCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { isIterable, cleanObserver } from '../utils';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const controller = new CompositeCancellable();

  onSubscribe(controller);

  const { sources } = this;

  const buffer = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const completable of sources) {
    if (completable instanceof Completable) {
      buffer.unshift(completable);
    } else {
      onError(new Error('Completable.amb: One of the sources is a non-Completable.'));
      controller.cancel();
      return;
    }
  }

  let pending = buffer.length;
  for (const completable of buffer) {
    completable.subscribeWith({
      onSubscribe(ac) {
        controller.add(ac);
      },
      onComplete() {
        pending -= 1;

        if (pending === 0) {
          onComplete();
          controller.cancel();
        }
      },
      onError(x) {
        onError(x);
        controller.cancel();
      },
    });
  }
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isIterable(sources)) {
    return error(new Error('Completable.concat: sources is not Iterable.'));
  }
  const completable = new Completable(subscribeActual);
  completable.sources = sources;
  return completable;
};
