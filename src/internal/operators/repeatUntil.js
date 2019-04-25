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

  const { source, predicate } = this;

  const sub = () => {
    controller.unlink();
    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete() {
        if (isFunction(predicate)) {
          const result = predicate();

          if (result) {
            onComplete();
          } else {
            sub();
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
export default (source, predicate) => {
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.predicate = predicate;
  return completable;
};
