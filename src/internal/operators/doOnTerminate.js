import Completable from '../../completable';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete(x) {
      callable();
      onComplete(x);
    },
    onError(x) {
      callable();
      onError(x);
    },
  });
}

/**
 * @ignore
 */
export default (source, callable) => {
  if (!isFunction(callable)) {
    return source;
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.callable = callable;
  return completable;
};
