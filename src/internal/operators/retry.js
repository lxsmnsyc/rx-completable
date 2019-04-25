import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = cleanObserver(observer);

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  const { source, bipredicate } = this;

  let retries = -1;

  const sub = () => {
    controller.unlink();
    retries += 1;

    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onError(x) {
        if (isFunction(bipredicate)) {
          const result = bipredicate(retries, x);

          if (result) {
            sub();
          } else {
            onError(x);
          }
        } else {
          sub();
        }
      },
    });
  };

  sub();
}

/**
 * @ignore
 */
export default (source, bipredicate) => {
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.bipredicate = bipredicate;
  return completable;
};
