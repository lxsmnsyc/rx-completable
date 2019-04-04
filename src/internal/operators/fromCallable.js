import AbortController from 'abort-controller';
import {
  isPromise, cleanObserver,
} from '../utils';
import Completable from '../../completable';
import error from './error';
import fromPromise from './fromPromise';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const obs = cleanObserver(observer);
  const { onComplete, onError, onSubscribe } = obs;

  const controller = new AbortController();

  onSubscribe(controller);

  if (controller.signal.aborted) {
    return;
  }

  let result;
  try {
    result = this.callable();
  } catch (e) {
    onError(e);
    return;
  }

  if (isPromise(result)) {
    fromPromise(result).subscribeWith(obs);
  } else {
    onComplete();
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
