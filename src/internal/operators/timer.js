import Completable from '../../completable';
import { cleanObserver, isNumber, defaultScheduler } from '../utils';
import error from './error';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onSubscribe } = cleanObserver(observer);

  onSubscribe(this.scheduler.delay(onComplete, this.amount));
}
/**
 * @ignore
 */
export default (amount, scheduler) => {
  if (!isNumber(amount)) {
    return error(new Error('Completable.timer: "amount" is not a number.'));
  }
  const completable = new Completable(subscribeActual);
  completable.amount = amount;
  completable.scheduler = defaultScheduler(scheduler);
  return completable;
};
