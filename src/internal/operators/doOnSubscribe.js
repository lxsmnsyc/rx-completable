import Completable from '../../completable';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe(d) {
      callable(d);
      onSubscribe(d);
    },
    onComplete,
    onError,
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
