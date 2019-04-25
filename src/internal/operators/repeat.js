import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isNumber, exists } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const { source, times } = this;

  let retries = -1;

  const sub = () => {
    controller.unlink();
    retries += 1;

    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete() {
        if (isNumber(times)) {
          if (retries <= times) {
            sub();
          } else {
            onComplete();
          }
        } else {
          sub();
        }
      },
      onError,
    });
  };

  sub();
}

/**
 * @ignore
 */
export default (source, times) => {
  if (exists(times)) {
    if (!isNumber(times)) {
      return source;
    }
    if (times <= 0) {
      return source;
    }
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.times = times;
  return completable;
};
