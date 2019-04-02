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

  const { source, times } = this;

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
        if (typeof times === 'number') {
          if (retries <= times) {
            sub();
          } else {
            onComplete();
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
export default (source, times) => {
  if (times != null) {
    if (typeof times !== 'number') {
      return source;
    }
    if (times <= 0) {
      return source;
    }
  }
  const completable = new Completable();
  completable.source = source;
  completable.times = times;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
