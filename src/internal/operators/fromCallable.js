import AbortController from 'abort-controller';
import {
  onErrorHandler, onCompleteHandler, isPromise, cleanObserver,
} from '../utils';
import Completable from '../../completable';
import error from './error';
import fromPromise from './fromPromise';

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

  const resolve = onCompleteHandler.bind(this);
  const reject = onErrorHandler.bind(this);

  let result;
  try {
    result = this.callable();
  } catch (e) {
    reject(e);
    return;
  }

  if (isPromise(result)) {
    fromPromise(result).subscribe(onComplete, onError);
  } else {
    resolve(result);
  }
}
/**
 * @ignore
 */
export default (callable) => {
  if (typeof callable !== 'function') {
    return error(new Error('Completable.fromCallable: callable received is not a function.'));
  }
  const completable = new Completable(subscribeActual);
  completable.callable = callable;
  return completable;
};
