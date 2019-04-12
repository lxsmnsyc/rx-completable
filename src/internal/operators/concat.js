/* eslint-disable no-restricted-syntax */
import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { isIterable, cleanObserver } from '../utils';
import error from './error';

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
    if (completable instanceof Completable) {
      buffer.unshift(completable);
    } else {
      onError(new Error('Completable.amb: One of the sources is a non-Completable.'));
      controller.cancel();
      return;
    }
  }

  let current;
  for (const completable of buffer) {
    if (typeof current === 'undefined') {
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
  if (!isIterable(sources)) {
    return error(new Error('Completable.concat: sources is not Iterable.'));
  }
  const completable = new Completable(subscribeActual);
  completable.sources = sources;
  return completable;
};
