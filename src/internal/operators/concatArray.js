/* eslint-disable no-restricted-syntax */
import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isArray } from '../utils';
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
  // eslint-disable-next-line no-restricted-syntax
  for (let i = 0; i < length; i += 1) {
    const completable = sources[i];
    if (!is(completable)) {
      onError(new Error('Completable.concatArray: One of the sources is a non-Completable.'));
      controller.cancel();
      return;
    }
  }

  let counter = 0;
  const sub = () => {
    controller.unlink();
    sources[0].subscribeWith({
      onSubscribe(c) {
        controller.link(c);
      },
      onComplete() {
        counter += 1;

        if (counter === length) {
          onComplete();
        } else {
          sub();
        }
      },
      onError,
    });
  };
  sub();
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
