import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = cleanObserver(observer);

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  const { source, predicate } = this;

  let retries = 0;

  const sub = () => {
    if (signal.aborted) {
      return;
    }
    retries += 1;

    source.subscribeWith({
      onSubscribe(ac) {
        signal.addEventListener('abort', () => ac.abort());
      },
      onComplete() {
        onComplete();
        if (typeof predicate === 'function') {
          const result = predicate(retries);

          if (result) {
            sub();
          }
        } else {
          sub();
        }
      },
      onError(x) {
        onError(x);
        controller.abort();
      },
    });
  };

  sub();
}

/**
 * @ignore
 */
export default (source, predicate) => {
  const completable = new Completable();
  completable.source = source;
  completable.predicate = predicate;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
