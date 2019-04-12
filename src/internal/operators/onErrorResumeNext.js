import { LinkedCancellable } from 'rx-cancellable';
import Completable from '../../completable';
import { cleanObserver, isFunction } from '../utils';

function subscribeActual(observer) {
  const { onComplete, onError, onSubscribe } = cleanObserver(observer);

  const { source, resumeIfError } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  source.subscribeWith({
    onSubscribe(ac) {
      controller.link(ac);
    },
    onComplete,
    onError(x) {
      controller.unlink();

      let result;

      if (isFunction(resumeIfError)) {
        try {
          result = resumeIfError(x);
          if (!(result instanceof Completable)) {
            throw new Error('Completable.onErrorResumeNext: returned an non-Completable.');
          }
        } catch (e) {
          onError(new Error([x, e]));
          controller.cancel();
          return;
        }
      } else {
        result = resumeIfError;
      }

      result.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onError,
      });
    },
  });
}
/**
 * @ignore
 */
export default (source, resumeIfError) => {
  if (!(isFunction(resumeIfError) || resumeIfError instanceof Completable)) {
    return source;
  }

  const completable = new Completable(subscribeActual);
  completable.source = source;
  completable.resumeIfError = resumeIfError;
  return completable;
};
