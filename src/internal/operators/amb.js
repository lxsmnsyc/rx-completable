/* eslint-disable no-restricted-syntax */
import { CompositeCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { isIterable, cleanObserver } from '../utils';
import error from './error';
import is from '../is';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const controller = new CompositeCancellable();

  onSubscribe(controller);

  const { sources } = this;

  for (const completable of sources) {
    if (controller.cancelled) {
      return;
    }

    if (is(completable)) {
      completable.subscribeWith({
        onSubscribe(c) {
          controller.add(c);
        },
        // eslint-disable-next-line no-loop-func
        onComplete() {
          onComplete();
          controller.cancel();
        },
        onError(x) {
          onError(x);
          controller.cancel();
        },
      });
    } else {
      onError(new Error('Completable.amb: One of the sources is a non-Completable.'));
      controller.cancel();
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
  const completable = new Completable(subscribeActual);
  completable.sources = sources;
  return completable;
};
