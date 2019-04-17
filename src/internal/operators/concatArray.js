/* eslint-disable no-restricted-syntax */
import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isArray, isNull } from '../utils';
import error from './error';
import is from '../is';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const controller = new LinkedCancellable();

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
      onError(new Error('Completable.concatArray: One of the sources is a non-Completable.'));
      controller.cancel();
      return;
    }
  }

  let current;
  for (let i = 0; i < length; i += 1) {
    const completable = buffer[i];
    if (isNull(current)) {
      current = () => {
        completable.subscribeWith({
          onSubscribe(ac) {
            controller.link(ac);
          },
          onComplete,
          onError,
        });
      };
    } else {
      const prev = current;
      current = () => {
        completable.subscribeWith({
          onSubscribe(ac) {
            controller.link(ac);
          },
          onComplete() {
            controller.unlink();
            prev();
          },
          onError,
        });
      };
    }
  }

  current();
}
/**
 * @ignore
 */
export default (sources) => {
  if (!isArray(sources)) {
    return error(new Error('Completable.concatArray: sources is non-Array.'));
  }
  const completable = new Completable(subscribeActual);
  completable.sources = sources;
  return completable;
};
