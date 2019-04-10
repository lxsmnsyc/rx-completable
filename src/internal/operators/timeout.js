
import AbortController from 'abort-controller';
import Scheduler from 'rx-scheduler';
import Completable from '../../completable';
import { cleanObserver, isNumber } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { amount, scheduler } = this;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const timeout = scheduler.delay(
    () => {
      onError(new Error('Completable.timeout: TimeoutException (no success signals within the specified timeout).'));
      controller.abort();
    },
    amount,
  );

  signal.addEventListener('abort', () => timeout.abort());

  this.source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      onComplete();
      controller.abort();
    },
    onError(x) {
      onError(x);
      controller.abort();
    },
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
