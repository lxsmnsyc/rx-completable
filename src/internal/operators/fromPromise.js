import AbortController from 'abort-controller';
import Completable from '../../completable';
import {
  isPromise, cleanObserver,
} from '../utils';
import error from './error';
/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);
  const controller = new AbortController();

  onSubscribe(controller);

  if (controller.signal.aborted) {
    return;
  }

  this.promise.then(
    () => onComplete(),
    onError,
  );
}
/**
 * @ignore
 */
export default (promise) => {
  if (!isPromise(promise)) {
    return error(new Error('Completable.fromPromise: expects a Promise-like value.'));
  }
  const completable = new Completable(subscribeActual);
  completable.promise = promise;
  return completable;
};
