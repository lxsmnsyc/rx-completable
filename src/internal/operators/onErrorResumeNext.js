import AbortController from 'abort-controller';
import Completable from '../../completable';
import { cleanObserver } from '../utils';

function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { source, resumeIfError } = this;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => ac.abort());
    },
    onComplete() {
      onComplete();
      controller.abort();
    },
    onError(x) {
      let result;

      if (typeof resumeIfError === 'function') {
        try {
          result = resumeIfError(x);
          if (!(result instanceof Completable)) {
            throw new Error('Completable.onErrorResumeNext: returned an non-Completable.');
          }
        } catch (e) {
          onError(new Error([x, e]));
          return;
        }
      } else {
        result = resumeIfError;
      }

      result.subscribeWith({
        onSubscribe(ac) {
          signal.addEventListener('abort', () => ac.abort());
        },
        onComplete() {
          onComplete();
          controller.abort();
        },
        onError(v) {
          onError(v);
          controller.abort();
        },
      });
    },
  });
}
/**
 * @ignore
 */
export default (source, resumeIfError) => {
  if (!(typeof resumeIfError === 'function' || resumeIfError instanceof Completable)) {
    return source;
  }

  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.resumeIfError = resumeIfError;
  return completable;
};
