import { cleanObserver } from '../utils';
import Completable from '../../completable';
import error from './error';
import CompletableEmitter from '../../emitter';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const emitter = new CompletableEmitter(onComplete, onError);

  onSubscribe(emitter);

  try {
    this.subscriber(emitter);
  } catch (ex) {
    emitter.onError(ex);
  }
}
/**
 * @ignore
 */
export default (subscriber) => {
  if (typeof subscriber !== 'function') {
    return error(new Error('Completable.create: There are no subscribers.'));
  }
  const completable = new Completable(subscribeActual);
  completable.subscriber = subscriber;
  return completable;
};
