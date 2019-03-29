import Completable from '../../completable';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSubscribe, onComplete, onError } = observer;

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe,
    onComplete() {
      callable();
      onComplete();
    },
    onError,
  });
}

/**
 * @ignore
 */
export default (source, callable) => {
  if (typeof callable !== 'function') {
    return source;
  }

  const completable = new Completable();
  completable.source = source;
  completable.callable = callable;
  completable.subscribeActual = subscribeActual.bind(completable);
  return completable;
};
