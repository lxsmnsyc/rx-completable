import {
  cleanObserver, isFunction,
} from '../utils';
import Completable from '../../completable';
import error from './error';
import CompletableEmitter from '../../emitter';

function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const emitter = new CompletableEmitter(onComplete, onError);

  onSubscribe(emitter);

  this.subscriber(
    () => emitter.onComplete(),
    x => emitter.onError(x),
  );
}
/**
 * @ignore
 */
export default (subscriber) => {
  if (!isFunction(subscriber)) {
    return error(new Error('Completable.fromResolvable: expects a function.'));
  }
  const completable = new Completable(subscribeActual);
  completable.subscriber = subscriber;
  return completable;
};
