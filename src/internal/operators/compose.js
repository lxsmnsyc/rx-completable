import Completable from '../../completable';
import error from './error';

/**
 * @ignore
 */
export default (source, transformer) => {
  if (typeof transformer !== 'function') {
    return source;
  }

  let result;

  try {
    result = transformer(source);

    if (!(result instanceof Completable)) {
      throw new Error('Completable.compose: transformer returned a non-Completable.');
    }
  } catch (e) {
    result = error(e);
  }

  return result;
};
