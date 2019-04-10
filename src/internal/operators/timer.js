import AbortController from 'abort-controller';
import Scheduler from 'rx-scheduler';
import Completable from '../../completable';
import { cleanObserver, isNumber } from '../utils';
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

  const timeout = this.scheduler.delay(() => onComplete(), this.amount);

  signal.addEventListener('abort', () => timeout.abort());
}
/**
 * @ignore
 */
export default (amount, scheduler) => {
  if (!isNumber(amount)) {
    return error(new Error('Completable.timer: "amount" is not a number.'));
  }

  let sched = scheduler;
  if (!(sched instanceof Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const completable = new Completable(subscribeActual);
  completable.amount = amount;
  completable.scheduler = sched;
  return completable;
};
