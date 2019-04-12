import Completable from '../../completable';
import {
  isPromise, cleanObserver,
} from '../utils';
import error from './error';
import SingleEmitter from '../../emitter';
/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const emitter = new SingleEmitter(onComplete, onError);

  onSubscribe(emitter);

  this.promise.then(
    () => emitter.onComplete(),
    x => emitter.onError(x),
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
