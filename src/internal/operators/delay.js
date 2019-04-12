import Scheduler from 'rx-scheduler';
import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isNumber } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { amount, scheduler, doDelayError } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  this.source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete() {
      controller.link(scheduler.delay(() => {
        onComplete();
      }, amount));
    },
    onError(x) {
      controller.link(scheduler.delay(() => {
        onError(x);
      }, doDelayError ? amount : 0));
    },
  });
}
/**
 * @ignore
 */
export default (source, amount, scheduler, doDelayError) => {
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
  completable.doDelayError = doDelayError;
  return completable;
};
