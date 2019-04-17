/* eslint-disable no-restricted-syntax */
import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { isIterable, cleanObserver } from '../utils';
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

  const buffer = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const completable of sources) {
    if (is(completable)) {
      buffer.push(completable);
    } else {
      onError(new Error('Completable.concat: One of the sources is a non-Completable.'));
      controller.cancel();
      return;
    }
  }

  const { length } = buffer;
  let counter = 0;
  const sub = () => {
    controller.unlink();
    buffer[0].subscribeWith({
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
  if (!isIterable(sources)) {
    return error(new Error('Completable.concat: sources is not Iterable.'));
  }
  const completable = new Completable(subscribeActual);
  completable.sources = sources;
  return completable;
};
