/* eslint-disable no-restricted-syntax */
import { CompositeCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, immediateError, isArray } from '../utils';
import error from './error';
import is from '../is';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { sources } = this;
  const { length } = sources;

  if (length === 0) {
    immediateError(observer, new Error('Completable.ambArray: sources Array is empty.'));
  } else {
    const controller = new CompositeCancellable();

    onSubscribe(controller);

    for (let i = 0; i < length; i += 1) {
      const completable = sources[i];
      if (controller.cancelled) {
        return;
      }
      if (is(completable)) {
        completable.subscribeWith({
          onSubscribe(c) {
            controller.add(c);
          },
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
        onError(new Error('Completable.ambArray: One of the sources is a non-Completable.'));
        controller.cancel();
        break;
      }
    }
  }
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isArray(sources)) {
    return error(new Error('Completable.ambArray: sources is not an Array.'));
  }
  const completable = new Completable(subscribeActual);
  completable.sources = sources;
  return completable;
};
