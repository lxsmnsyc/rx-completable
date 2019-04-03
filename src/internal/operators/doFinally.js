import Completable from '../../completable';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { source, callable } = this;

  let called = false;
  source.subscribeWith({
    onSubscribe(ac) {
      ac.signal.addEventListener('abort', () => {
        if (!called) {
          callable();
          called = true;
        }
      });
      onSubscribe(ac);
    },
    onComplete() {
      onComplete();
      if (!called) {
        callable();
        called = true;
      }
    },
    onError(x) {
      onError(x);
      if (!called) {
        callable();
        called = true;
      }
    },
  });
}

/**
 * @ignore
 */
export default (source, callable) => {
  if (typeof callable !== 'function') {
    return source;
  }

  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.callable = callable;
  return completable;
};
