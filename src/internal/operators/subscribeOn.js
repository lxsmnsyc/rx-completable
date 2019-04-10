import AbortController from 'abort-controller';
import Scheduler from 'rx-scheduler';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = cleanObserver(observer);

  const { source, scheduler } = this;

  const controller = new AbortController();
  onSubscribe(controller);

  const { signal } = controller;

  if (signal.aborted) {
    return;
  }

  scheduler.schedule(() => {
    if (signal.aborted) {
      return;
    }
    source.subscribeWith({
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
  });
}
/**
 * @ignore
 */
export default (source, scheduler) => {
  let sched = scheduler;
  if (!(sched instanceof Scheduler.interface)) {
    sched = Scheduler.current;
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.scheduler = sched;
  return completable;
};
