import Completable from '../../completable';
import { isObserver, immediateError } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  let result;

  try {
    result = this.operator(observer);

    if (!isObserver(result)) {
      throw new Error('Completable.lift: operator returned a non-Observer.');
    }
  } catch (e) {
    immediateError(observer, e);
    return;
  }

  this.source.subscribeWith(result);
}

/**
 * @ignore
 */
export default (source, operator) => {
  if (typeof operator !== 'function') {
    return source;
  }

  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.operator = operator;
  return completable;
};
