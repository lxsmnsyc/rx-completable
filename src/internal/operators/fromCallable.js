import Completable from '../../completable';
import CompletableEmitter from '../../emitter';
import error from './error';
import fromPromise from './fromPromise';
import {
  isPromise, cleanObserver, isFunction,
} from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const emitter = new CompletableEmitter(onComplete, onError);

  onSubscribe(emitter);

  let result;
  try {
    result = this.callable();
  } catch (e) {
    emitter.onError(e);
    return;
  }

  if (isPromise(result)) {
    fromPromise(result).subscribeWith({
      onSubscribe(ac) {
        emitter.setCancellable(ac);
      },
      onComplete() {
        emitter.onComplete();
      },
      onError(e) {
        emitter.onError(e);
      },
    });
  } else {
    emitter.onComplete();
  }
}
/**
 * @ignore
 */
export default (callable) => {
  if (!isFunction(callable)) {
    return error(new Error('Completable.fromCallable: callable received is not a function.'));
  }
  const completable = new Completable(subscribeActual);
  completable.callable = callable;
  return completable;
};
