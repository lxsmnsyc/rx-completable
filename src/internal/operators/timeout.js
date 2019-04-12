import Scheduler from 'rx-scheduler';
import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isNumber } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { amount, scheduler } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const timeout = scheduler.delay(
    () => {
      onError(new Error('Completable.timeout: TimeoutException (no success signals within the specified timeout).'));
      controller.cancel();
    },
    amount,
  );

  controller.addEventListener('cancel', () => timeout.cancel());

  this.source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete,
    onError,
  });
}
/**
 * @ignore
 */
export default (source, amount, scheduler) => {
  if (!isNumber(amount)) {
    return source;
  }
  let sched = scheduler;
  if (!(sched instanceof Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.amount = amount;
  completable.scheduler = sched;
  return completable;
};
