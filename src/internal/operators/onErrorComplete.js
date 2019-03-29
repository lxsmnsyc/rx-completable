import Completable from '../../completable';
import { cleanObserver } from '../utils';

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
  if (typeof item !== 'function') {
    return source;
  }

  const completable = new Completable();
  completable.source = source;
  completable.item = item;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
