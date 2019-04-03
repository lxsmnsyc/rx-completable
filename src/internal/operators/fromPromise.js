import AbortController from 'abort-controller';
import Completable from '../../completable';
import {
  isPromise, onCompleteHandler, onErrorHandler, cleanObserver,
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

  this.controller = controller;
  this.onComplete = onComplete;
  this.onError = onError;

  this.promise.then(
    onCompleteHandler.bind(this),
    onErrorHandler.bind(this),
  );
}
/**
 * @ignore
 */
export default (promise) => {
  if (!isPromise(promise)) {
    return error(new Error('Completable.fromPromise: expects a Promise-like value.'));
  }
  const completable = new Completable();
  completable.promise = promise;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
