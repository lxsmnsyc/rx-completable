import Scheduler from 'rx-scheduler';
import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = cleanObserver(observer);

  const { source, scheduler } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  controller.link(scheduler.schedule(() => {
    controller.unlink();
    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onError,
    });
  }));
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
