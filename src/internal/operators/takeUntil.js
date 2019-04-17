import { CompositeCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver } from '../utils';
import is from '../is';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = cleanObserver(observer);

  const controller = new CompositeCancellable();

  onSubscribe(controller);

  const { source, other } = this;

  other.subscribeWith({
    onSubscribe(ac) {
      controller.add(ac);
    },
    onComplete() {
      onError(new Error('Completable.takeUntil: Source cancelled by other Completable.'));
      controller.cancel();
    },
    onError(x) {
      onError(new Error(['Completable.takeUntil: Source cancelled by other Completable.', x]));
      controller.cancel();
    },
  });

  source.subscribeWith({
    onSubscribe(ac) {
      controller.add(ac);
    },
    onComplete() {
      onComplete();
      controller.cancel();
    },
    onError(x) {
      onError(x);
      controller.cancel();
    },
  });
}

/**
 * @ignore
 */
const takeUntil = (source, other) => {
  if (!is(other)) {
    return source;
  }

  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.other = other;
  return completable;
};

export default takeUntil;
