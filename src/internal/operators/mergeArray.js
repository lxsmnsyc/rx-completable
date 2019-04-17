/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import { CompositeCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isArray } from '../utils';
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
  const { length } = sources;
  const buffer = [];
  // eslint-disable-next-line no-restricted-syntax
  for (let i = 0; i < length; i += 1) {
    const completable = sources[i];
    if (is(completable)) {
      buffer.unshift(completable);
    } else {
      onError(new Error('Completable.mergeArray: One of the sources is a non-Completable.'));
      controller.cancel();
      return;
    }
  }

  let pending = length;
  for (let i = 0; i < length; i += 1) {
    const completable = sources[i];
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
  if (!isArray(sources)) {
    return error(new Error('Completable.merge: sources is non-Array.'));
  }
  const completable = new Completable(subscribeActual);
  completable.sources = sources;
  return completable;
};
