import AbortController from 'abort-controller';
import { onErrorHandler, onCompleteHandler } from '../utils';
import Completable from '../../completable';
import error from './error';

function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = observer;

  const controller = new AbortController();

  onSubscribe(controller);

  if (controller.signal.aborted) {
    return;
  }

  this.controller = controller;
  this.onComplete = onComplete;
  this.onError = onError;

  const resolve = onCompleteHandler.bind(this);
  const reject = onErrorHandler.bind(this);

  this.subscriber(resolve, reject);
}
/**
 * @ignore
 */
export default (subscriber) => {
  if (typeof subscriber !== 'function') {
    return error(new Error('Completable.fromResolvable: expects a function.'));
  }
  const completable = new Completable();
  completable.subscriber = subscriber;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
