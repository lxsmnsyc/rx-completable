import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, defaultScheduler } from '../utils';

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
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.scheduler = defaultScheduler(scheduler);
  return completable;
};
