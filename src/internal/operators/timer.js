import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onSubscribe } = cleanObserver(observer);


  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const timeout = setTimeout(onComplete, this.amount);

  signal.addEventListener('abort', () => {
    clearTimeout(timeout);
  });
}
/**
 * @ignore
 */
export default (amount) => {
  if (typeof amount !== 'number') {
    return error(new Error('Completable.timer: "amount" is not a number.'));
  }
  const completable = new Completable(subscribeActual);
  completable.amount = amount;
  return completable;
};
