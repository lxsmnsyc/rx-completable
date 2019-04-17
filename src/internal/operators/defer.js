import Completable from '../../completable';
import { immediateError, cleanObserver, exists } from '../utils';
import is from '../is';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  let result;

  let err;
  try {
    result = this.supplier();
    if (!is(result)) {
      throw new Error('Completable.defer: supplier returned a non-Completable.');
    }
  } catch (e) {
    err = e;
  }

  if (exists(err)) {
    immediateError(observer, err);
  } else {
    result.subscribeWith({
      onSubscribe,
      onComplete,
      onError,
    });
  }
}
/**
 * @ignore
 */
export default (supplier) => {
  const completable = new Completable(subscribeActual);
  completable.supplier = supplier;
  return completable;
};
