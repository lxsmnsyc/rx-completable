import { toCallable, immediateError } from '../utils';
import Completable from '../../completable';

/**
 * @ignore
 */
function subscribeActual(observer) {
  let err;

  try {
    err = this.supplier();

    if (typeof err === 'undefined') {
      throw new Error('Completable.error: Error supplier returned an undefined value.');
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
  if (!(value instanceof Error)) {
    report = new Error('Completable.error received a non-Error value.');
  }

  if (typeof value !== 'function') {
    report = toCallable(report);
  }
  const completable = new Completable();
  completable.supplier = report;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
