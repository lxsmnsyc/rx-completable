import Completable from '../../completable';
import error from './error';
import { isFunction } from '../utils';

/**
 * @ignore
 */
export default (source, transformer) => {
  if (!isFunction(transformer)) {
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
