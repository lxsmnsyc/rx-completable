import AbortController from 'abort-controller';
import {
  onErrorHandler, onCompleteHandler, cleanObserver,
} from '../utils';
import Completable from '../../completable';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const emitter = new AbortController();
  emitter.onComplete = onCompleteHandler.bind(this);
  emitter.onError = onErrorHandler.bind(this);

  this.controller = emitter;
  this.onComplete = onComplete;
  this.onError = onError;

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
  const single = new Completable(subscribeActual);
  single.subscriber = subscriber;
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};
