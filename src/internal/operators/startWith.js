import concat from './concat';
import Completable from '../../completable';

/**
 * @ignore
 */
export default (source, other) => {
  if (!(other instanceof Completable)) {
    return source;
  }
  return concat([other, source]);
};
