import Completable from '../../completable';
import { cleanObserver, isFunction } from '../utils';

function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { source, item } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete,
    onError(x) {
      let result;
      try {
        result = item(x);
      } catch (e) {
        onError([x, e]);
        return;
      }
      if (result) {
        onComplete();
      } else {
        onError(x);
      }
    },
  });
}
/**
 * @ignore
 */
export default (source, item) => {
  if (!isFunction(item)) {
    return source;
  }
  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.item = item;
  return completable;
};
