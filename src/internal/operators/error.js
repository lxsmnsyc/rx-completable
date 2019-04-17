import {
  toCallable, immediateError, isFunction, isOf, isNull,
} from '../utils';
import Completable from '../../completable';

/**
 * @ignore
 */
function subscribeActual(observer) {
  let err;

  try {
    err = this.supplier();

    if (isNull(err)) {
      throw new Error('Completable.error: Error supplier returned a null value.');
    }
  } catch (e) {
    err = e;
  }
  immediateError(observer, err);
}
/**
 * @ignore
 */
export default (value) => {
  let report = value;
  if (!(isOf(value, Error) || isFunction(value))) {
    report = new Error('Completable.error received a non-Error value.');
  }

  if (!isFunction(report)) {
    report = toCallable(report);
  }
  const completable = new Completable(subscribeActual);
  completable.supplier = report;
  return completable;
};
